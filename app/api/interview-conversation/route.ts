import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { getWorkflowState, saveWorkflowState } from '../../../lib/actions/interview.actions';
import { supabaseAdmin } from '@/lib/supabase/client';
import { auth } from '@/lib/supabase/auth';

// Configure runtime for Vercel
export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Initialize TTS client with proper credentials handling
let ttsClient: TextToSpeechClient;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // Use JSON credentials for deployment (Vercel, etc.)
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  ttsClient = new TextToSpeechClient({ credentials });
} else {
  // Use file path for local development
  ttsClient = new TextToSpeechClient();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const conversationContext = formData.get('context') as string || '';
    const systemPrompt = formData.get('systemPrompt') as string || '';
    const interviewId = formData.get('interviewId') as string;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    // Use default interview ID for testing if none provided
    const effectiveInterviewId = interviewId || 'test-default-interview';
    
    console.log('Using interview ID:', effectiveInterviewId);

    // Convert audio file to buffer
    const audioBuffer = await audioFile.arrayBuffer();
    
    // Initialize Gemini model - Use the more capable model for better Japanese
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });
    
    // Step 1: First, get the transcript of the audio with improved Japanese prompt
    const transcriptionPrompt = `以下の音声ファイルを日本語で正確に文字起こししてください。
話者の発言内容のみを記載し、余計なコメントや説明は一切含めないでください。
自然な日本語として聞こえるように、適切な句読点も含めてください。`;
    
    const transcriptionResult = await model.generateContent([
      {
        inlineData: {
          mimeType: audioFile.type,
          data: Buffer.from(audioBuffer).toString('base64')
        }
      },
      transcriptionPrompt
    ]);

    const transcript = transcriptionResult.response.text().trim();
    
    // Step 2: Load workflow state from database and fetch interview data to get industry
    const dbWorkflowState = await getWorkflowState(effectiveInterviewId);
    
    // Fetch interview data to get the selected industry
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    const { data: interviewData, error: interviewError } = await supabaseAdmin
      .from("interviews")
      .select("interviewFocus")
      .eq("id", effectiveInterviewId)
      .eq("author", userId)
      .single();
    
    if (interviewError || !interviewData) {
      console.error("Failed to fetch interview data:", interviewError);
      return NextResponse.json({ error: "Failed to fetch interview data" }, { status: 500 });
    }
    
    const selectedIndustry = interviewData.interviewFocus;
    
    // Industry-specific questions data
    const industryQuestions = {
      consulting: [
        {
          id: 'consulting_case_light',
          prompt: 'フェルミ推定：日本のコンビニの年間コーヒー販売杯数を概算してください（仮定→分解→計算→示唆）。',
          expected_data: ['assumptions','structure','calculation_steps','sense_check','insights']
        },
        {
          id: 'problem_structuring',
          prompt: '「国内アパレルECの成長が鈍化」の要因をMECEに分解し、優先仮説を1つ提示してください。',
          expected_data: ['issue_tree','hypotheses','prioritization_reason']
        },
        {
          id: 'client_communication',
          prompt: '困難なクライアントをどう巻き込み、合意形成しましたか？',
          expected_data: ['context','stakeholders','tactics','outcome']
        },
        {
          id: 'thinktank_policy',
          prompt: '関心のある政策テーマと、その効果検証設計（KPI/データ/手法）を簡潔に説明してください。',
          expected_data: ['policy_theme','kpi','data_sources','method']
        },
        {
          id: 'consulting_fit',
          prompt: 'ハードワーク環境で心身をどうセルフマネジメントしますか？',
          expected_data: ['stress_signs','routines','safeguards']
        }
      ],
      finance: [
        {
          id: 'finance_markets_quickcheck',
          prompt: '直近のマーケット（株価指数/為替/金利）の変動要因を1分で要約してください。',
          expected_data: ['index_fx_rate','movement','drivers','sources']
        },
        {
          id: 'finance_news',
          prompt: '最近注目したM&A/金融規制ニュースを挙げ、当該プレーヤーの狙いを推測してください。',
          expected_data: ['news_topic','players','rationale','implications']
        },
        {
          id: 'risk_compliance',
          prompt: 'コンプライアンスと収益性が競合する局面での判断軸を教えてください。',
          expected_data: ['principles','precedents','decision']
        },
        {
          id: 'numeracy_check',
          prompt: '年1.5%の複利で100万円を5年運用。概算最終金額を口頭で算出してください。',
          expected_data: ['approx_method','result']
        },
        {
          id: 'client_trust',
          prompt: '個人/法人いずれかを選び、信頼構築のための初回ヒアリング設計を説明してください。',
          expected_data: ['segmentation','questions_plan','risk_disclosure']
        }
      ],
      manufacturing: [
        {
          id: 'monodukuri_motivation',
          prompt: 'ものづくりに惹かれた具体的契機と、対象製品/工程で活かせる強みを教えてください。',
          expected_data: ['trigger','target_product_or_process','skills']
        },
        {
          id: 'rd_or_prodexp',
          prompt: '研究/設計/生産いずれかを選び、課題→仮説→実験/対策→検証の経験を説明してください。',
          expected_data: ['problem','hypothesis','action','validation','quant_result']
        },
        {
          id: 'quality_cost_delivery',
          prompt: '品質・コスト・納期（QCD）のトレードオフで下した判断を例示してください。',
          expected_data: ['context','tradeoff','decision','impact']
        },
        {
          id: 'site_adaptability',
          prompt: '現場（工場/サプライヤ）配属の生活・安全面での自己管理方針を教えてください。',
          expected_data: ['safety_mind','shift_or_transfer','healthcare']
        },
        {
          id: 'ip_and_learning',
          prompt: '技術キャッチアップの習慣（論文/特許/展示会 等）を教えてください。',
          expected_data: ['sources','cadence','recent_learning']
        }
      ],
      trading: [
        {
          id: 'why_sogo_shosha',
          prompt: 'なぜ総合商社か。他業界ではなく商社である必然性を論理的に説明してください。',
          expected_data: ['industry_reason','why_not_others','value_you_add']
        },
        {
          id: 'biz_dev_interest',
          prompt: '興味のある事業領域と、その共通する魅力（配属に依存しない軸）を述べてください。',
          expected_data: ['areas','common_axes','transferability']
        },
        {
          id: 'grit_and_mobility',
          prompt: 'タフな環境（長時間/海外/未整備）で成果を出した経験を教えてください。',
          expected_data: ['context','actions','result','learning']
        },
        {
          id: 'stakeholder_play',
          prompt: '多国籍の関係者を巻き込む際の交渉戦略を、具体ステップで説明してください。',
          expected_data: ['mapping','sequencing','give_and_take']
        },
        {
          id: 'company_specific_reason',
          prompt: '総合商社各社の違いを踏まえ、当社を選ぶ理由と逆質問を1つずつ提示してください。',
          expected_data: ['positioning_view','this_company_reason','reverse_q']
        }
      ],
      it: [
        {
          id: 'tech_interest',
          prompt: '最近キャッチアップしている技術トピックと、学習ソース/アウトプットを教えてください。',
          expected_data: ['topic','sources','artifact_or_code','impact']
        },
        {
          id: 'proj_problem_solving',
          prompt: '開発/データ/企画いずれかの小規模プロジェクトで、要件定義とスコープ管理をどう行いましたか？',
          expected_data: ['requirements','scope','tradeoffs','result']
        },
        {
          id: 'telecom_career',
          prompt: '通信キャリア志望の場合、ネットワーク/サービス/端末のどこで価値を出したいですか？',
          expected_data: ['layer','why','example_idea']
        },
        {
          id: 'security_privacy',
          prompt: 'ユーザデータを扱う際のセキュリティ/プライバシー配慮で意識していることは？',
          expected_data: ['threat_model','controls','past_behavior']
        },
        {
          id: 'dx_biz',
          prompt: '非IT業界の課題をデジタルで解くとしたら、どの課題に何を実装しますか？',
          expected_data: ['target_industry','pain_point','solution','kpi']
        }
      ],
      advertising: [
        {
          id: 'campaign_pitch',
          prompt: '20代向け新商品のプロモ案を60秒でピッチしてください（ターゲット→インサイト→施策→測定）。',
          expected_data: ['target','insight','idea','kpi']
        },
        {
          id: 'trend_sense',
          prompt: '最近刺さった広告/コンテンツを挙げ、評価軸で言語化してください。',
          expected_data: ['work','criteria','why']
        },
        {
          id: 'creative_process',
          prompt: '企画の発散と収束のプロセスを、過去の活動例で説明してください。',
          expected_data: ['diverge','converge','validation']
        },
        {
          id: 'media_ethics',
          prompt: '炎上/表現配慮のガイドラインをどう捉え、リスクを下げますか？',
          expected_data: ['guidelines','checks','fallback']
        },
        {
          id: 'account_roleplay',
          prompt: '（ロールプレイ）広告主から「効果が見えない」と言われた際の説明と追加提案を行ってください。',
          expected_data: ['diagnosis','explanation','new_plan']
        }
      ],
      hr: [
        {
          id: 'sales_fit',
          prompt: '個人/法人いずれかのRA/CA（両面/片面）を想定し、KPIの置き方と行動計画を説明してください。',
          expected_data: ['model','kpi','activity_plan']
        },
        {
          id: 'listening_skill',
          prompt: '候補者の「本音」を引き出した具体的ヒアリング手法を教えてください。',
          expected_data: ['questions','signals','trust_building']
        },
        {
          id: 'multi_stake',
          prompt: '企業・候補者・社内の利害調整で難しかった場面と対応を教えてください。',
          expected_data: ['context','tradeoffs','resolution']
        },
        {
          id: 'value_view',
          prompt: '「成果主義」と「候補者の長期幸福」の両立をどう実現しますか？',
          expected_data: ['principles','tactics','example']
        },
        {
          id: 'reverse_for_hr',
          prompt: '人材業界に特化した逆質問を1つ提示し、意図を説明してください。',
          expected_data: ['question','intent']
        }
      ],
      infrastructure: [
        {
          id: 'public_mission',
          prompt: '公共インフラの社会的使命を一言で定義し、日々の行動に落とす方法を述べてください。',
          expected_data: ['mission_phrase','daily_translation']
        },
        {
          id: 'safety_first',
          prompt: '安全・保安・災害対応での判断基準と、訓練/学習の習慣を教えてください。',
          expected_data: ['criteria','training','past_example']
        },
        {
          id: 'shift_and_resilience',
          prompt: 'シフト勤務/繁忙期/緊急呼び出しがある前提で、生活設計と体調管理をどう最適化しますか？',
          expected_data: ['schedule_design','sleep_nutrition','fallbacks']
        },
        {
          id: 'stake_local',
          prompt: '地域住民/行政/企業を巻き込む企画を1つ提案し、合意形成プランを説明してください。',
          expected_data: ['idea','stakeholders','consensus_plan']
        },
        {
          id: 'ethics_public',
          prompt: '公共性と採算性が衝突した際の考え方を教えてください。',
          expected_data: ['framework','examples','decision']
        }
      ],
      real_estate: [
        {
          id: 'real_estate_market',
          prompt: '最近の不動産市場のトレンドと、それが投資戦略に与える影響について説明してください。',
          expected_data: ['trend','impact','strategy']
        },
        {
          id: 'project_management',
          prompt: '建設プロジェクトでのスケジュール管理と品質管理をどう両立させましたか？',
          expected_data: ['approach','challenges','outcome']
        },
        {
          id: 'client_relations',
          prompt: '顧客との信頼関係構築で重視していることと、具体的な取り組みを教えてください。',
          expected_data: ['principles','methods','results']
        },
        {
          id: 'regulatory_compliance',
          prompt: '建築法規や環境規制への対応で工夫していることがあれば教えてください。',
          expected_data: ['compliance_approach','innovation','efficiency']
        },
        {
          id: 'sustainability',
          prompt: '持続可能な建設・開発に向けた取り組みや考えを聞かせてください。',
          expected_data: ['approach','examples','future_vision']
        }
      ]
    };
    
    // Industry name mapping for the final question
    const industryNames = {
      consulting: 'コンサルティング業界',
      finance: '金融業界',
      manufacturing: 'メーカー・製造業界',
      trading: '商社業界',
      it: 'IT・通信業界',
      advertising: '広告・マスコミ業界',
      hr: '人材業界',
      infrastructure: 'インフラ業界',
      real_estate: '不動産・建設業界'
    };
    
    // Generate dynamic workflow based on selected industry
    const generateWorkflow = () => {
      // Base questions that might be selected for later phases
      const baseQuestions = [
        {
          id: 'strength',
          prompt: 'ありがとうございます。では、次はあなたの強みについて伺います。ご自身の強みについて、具体的なエピソードと併せて教えていただけますでしょうか。',
          expected_data: ['strength', 'example', 'outcome'],
        },
        {
          id: 'weakness',
          prompt: 'ありがとうございます。では、次は改善点について伺います。ご自身の課題となる部分や改善点について、どのような対策を講じていらっしゃるか教えてください。',
          expected_data: ['weakness', 'coping_strategy'],
        },
        {
          id: 'personality',
          prompt: 'ありがとうございます。では、次は周囲からの評価について伺います。周囲からどのような人だと言われますか？具体的なエピソードと併せて教えてください。',
          expected_data: ['personality_type', 'example', 'outcome'],
        },
      ];
      
      // Select 1 random industry question
      const industryQs = industryQuestions[selectedIndustry as keyof typeof industryQuestions] || [];
      const randomIndustryQ = industryQs[Math.floor(Math.random() * industryQs.length)];
      
      // Select 1 random question from strength/weakness/personality
      const randomBaseQ = baseQuestions[Math.floor(Math.random() * baseQuestions.length)];
      
      // Randomly choose motivation question type
      const motivationVariations = [
        {
          expected_data: ['motivation', 'company_choice', 'company_challenges'],
          prompt_suffix: 'なぜこの業界、弊社なのですか？他社ではなく弊社を選ぶ理由は？また、当社の課題は何だと考えますか？それにどう貢献できますか？'
        },
        {
          expected_data: ['motivation', 'company_choice', 'future_goal'],
          prompt_suffix: 'なぜこの業界、弊社なのですか？他社ではなく弊社を選ぶ理由は？また、今後の目標についてもお聞かせください。'
        }
      ];
      const selectedMotivation = motivationVariations[Math.floor(Math.random() * motivationVariations.length)];
      
      // Create workflow phases without separate transitions
      const phases = [
        {
          id: 'self_intro',
          prompt: 'まずは簡単に自己紹介をお願いいたします。お名前、ご出身校、そして学生時代どのような活動をされていたかについて詳しく教えてください。',
          expected_data: ['name', 'education', 'university_activities'],
          next_state: 'industry_motivation',
        },
        {
          id: 'industry_motivation',
          prompt: `ありがとうございます。では、次は志望動機について伺います。${industryNames[selectedIndustry as keyof typeof industryNames]}を志望される理由について、${selectedMotivation.prompt_suffix}`,
          expected_data: selectedMotivation.expected_data,
          next_state: 'gakuchika',
          motivation_type: selectedMotivation.expected_data.includes('company_challenges') ? 'challenges' : 'future_goal'
        },
        {
          id: 'gakuchika',
          prompt: 'ありがとうございます。では、次は学生時代の取り組みについて伺います。学生時代に最も力を入れて取り組まれたことについて、具体的にお聞かせください。',
          expected_data: ['topic', 'actions', 'outcome'],
          next_state: randomBaseQ.id,
        },
        {
          ...randomBaseQ,
          next_state: randomIndustryQ.id,
        },
        {
          id: randomIndustryQ.id,
          prompt: `ありがとうございます。では、最後に業界に関する質問をさせていただきます。${randomIndustryQ.prompt}`,
          expected_data: randomIndustryQ.expected_data,
          next_state: 'end',
        },
      ];
      
      return phases;
    };
    
    // Generate workflow for this interview - ONLY generate once and persist
    let workflow;
    if (dbWorkflowState.workflowDefinition && Array.isArray(dbWorkflowState.workflowDefinition)) {
      // Use existing workflow from database
      workflow = dbWorkflowState.workflowDefinition;
      console.log('Using existing workflow from database:', workflow.map((p: any) => p.id));
    } else {
      // Generate new workflow for first time
      console.log('Generating new workflow for interview');
      workflow = generateWorkflow();
      console.log('Generated workflow phases:', workflow.map((p: any) => p.id));
    }
    
    // Use database state as primary source, fall back to context if needed
    const contextObj = JSON.parse(conversationContext || '{}');
    const history = dbWorkflowState.conversationHistory.length > 0 
      ? dbWorkflowState.conversationHistory 
      : (contextObj.history || []);

    type WorkflowPhaseId = typeof workflow[number]['id'] | 'end';

    // Use database workflow state as primary source
    let currentPhaseId: WorkflowPhaseId = (dbWorkflowState.currentPhaseId as WorkflowPhaseId) || 'self_intro';
    let questionCounts: Record<string, number> = dbWorkflowState.questionCounts || {};
    let fulfilled: Record<string, Record<string, string>> = dbWorkflowState.fulfilled || {};
    let failedPhases: string[] = Array.isArray(dbWorkflowState.failedPhases) ? dbWorkflowState.failedPhases : [];
    let finished: boolean = Boolean(dbWorkflowState.finished);
    let totalQuestionsAsked: number = Object.values(questionCounts).reduce((sum, count) => sum + count, 0);
    
    // Increase question limit to allow all 5 phases to complete
    // Each phase can have up to 3 questions, so maximum 15 questions for all phases
    // But we'll keep a reasonable limit to prevent infinite loops
    if (totalQuestionsAsked >= 15 && !finished) {
      finished = true;
      currentPhaseId = 'end';
    }
    
    // Get the last 4 rounds (8 messages: 4 user + 4 assistant)
    const recentHistory = history.slice(-8);
    
    // Render readable conversation
    let readableHistory = '';
    if (recentHistory.length > 0) {
      readableHistory = recentHistory.map((msg: { role: string; content: string }) =>
        msg.role === "user"
          ? `応募者：${msg.content}`
          : `面接官：${msg.content}`
      ).join('\n');
    }
    
    // Debug: Log conversation history for verification
    console.log('Conversation History being sent to AI:', {
      totalHistory: history.length,
      recentHistoryCount: recentHistory.length,
      readableHistory: readableHistory,
      currentTranscript: transcript
    });
    
    // Two-layer LLM: 1) assessor to extract fulfillment, 2) interviewer question
    const currentPhase = workflow.find(p => p.id === currentPhaseId);
    if (!currentPhase) {
      currentPhaseId = 'self_intro';
    }

    // Handle main phases (removed transition handling since transitions are now merged)
    // Initialize containers for current phase
    if (!fulfilled[currentPhaseId]) fulfilled[currentPhaseId] = {};
    if (questionCounts[currentPhaseId] == null) questionCounts[currentPhaseId] = 0;

    // 1) Improved Assessor prompt with better Japanese context understanding
    const assessorPrompt = `あなたは面接評価の専門家です。以下の面接の会話履歴と応募者の最新発言から、指定された評価項目に対応する情報が適切に回答されているかを分析してください。

【面接の会話履歴】
${readableHistory || '（面接開始前）'}

【応募者の最新発言】
${transcript}

【評価すべき項目】
${(workflow.find(p => p.id === currentPhaseId)!.expected_data).map((k: string) => `- ${k}`).join('\n')}

【出力形式】
以下のJSON形式でのみ回答してください。他の文章は一切含めないでください。

{
  "values": {
    "項目名": "回答内容（該当する情報が見つかった場合）" または null
  },
  "isComplete": true または false,
  "missing": ["不足している項目名のリスト"]
}

【評価基準】
- 応募者が実際に述べた内容のみを抽出する
- 推測や補完は行わない
- 全項目に具体的な回答がある場合のみisComplete: trueとする
- 日本語の敬語表現や口語表現も適切に理解する`;

    let assessorJson = { values: {} as Record<string, string | null>, isComplete: false, missing: [] as string[] };
    try {
      const assessorRes = await model.generateContent([assessorPrompt]);
      const assessorText = assessorRes.response.text();
      // Robust JSON extraction in case model returns extra text or code fences
      const match = assessorText.match(/\{[\s\S]*\}/);
      const jsonText = match ? match[0] : assessorText;
      assessorJson = JSON.parse(jsonText);
    } catch (error) {
      console.error('Assessor JSON parsing failed:', error);
      // If assessor fails, proceed without updating fulfillment
    }

    // Merge new values into fulfilled state
    const expectedKeys = [
      ...(workflow.find(p => p.id === currentPhaseId)!.expected_data as readonly string[]),
    ];

    // Improved Japanese name extraction with better patterns
    const extractJapaneseName = (text: string): string | null => {
      if (!text) return null;
      const cleaned = text.replace(/\s+/g, '').trim();
      
      // Pattern 1: 私の名前は〜です/私は〜と申します
      const patterns = [
        /(?:私(?:の)?名前は|名前は)\s*([あ-んア-ン一-龯々ー・\s]{2,10})(?:です|と申します|といいます)/,
        /私は\s*([あ-んア-ン一-龯々ー・\s]{2,10})(?:と申します|といいます|です)/,
        /([あ-んア-ン一-龯々ー・\s]{2,10})(?:と申します|といいます)(?:よろしく|。|$)/,
        /([あ-んア-ン一-龯々ー・]{2,10})(?:です|と申します)(?:よろしく|。|$)/
      ];
      
      for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match && match[1]) {
          const name = match[1].replace(/\s+/g, '').trim();
          if (name.length >= 2 && name.length <= 10) {
            return name;
          }
        }
      }
      return null;
    };
    
    // Extract university activities from self-intro
    const extractUniversityActivities = (text: string): string | null => {
      if (!text) return null;
      
      const patterns = [
        /学生時代(?:は|に)?([^。]+)/,
        /大学(?:時代)?(?:は|に)?([^。]+)/,
        /(?:部活|サークル|ゼミ|研究|アルバイト|インターン)(?:では?)?([^。]+)/
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].trim().length > 3) {
          return match[1].trim();
        }
      }
      return null;
    };

    for (const key of expectedKeys) {
      const val = (assessorJson.values as any)?.[key];
      if (val && typeof val === 'string' && val.trim().length > 0) {
        fulfilled[currentPhaseId][key] = val.trim();
      }
    }

    // If still missing 'name' in self-intro, try deterministic extraction from latest transcript
    if (currentPhaseId === 'self_intro' && expectedKeys.includes('name')) {
      if (!fulfilled[currentPhaseId]['name']) {
        const extracted = extractJapaneseName(transcript);
        if (extracted) {
          fulfilled[currentPhaseId]['name'] = extracted;
        }
      }
    }
    
    // If still missing 'university_activities' in self-intro, try deterministic extraction
    if (currentPhaseId === 'self_intro' && expectedKeys.includes('university_activities')) {
      if (!fulfilled[currentPhaseId]['university_activities']) {
        const extracted = extractUniversityActivities(transcript);
        if (extracted) {
          fulfilled[currentPhaseId]['university_activities'] = extracted;
        }
      }
    }

    // CORRECT PHASE ADVANCEMENT: Up to 3 questions per phase to fill all expected outcomes
    const allKeysFulfilled = expectedKeys.every(k => Boolean(fulfilled[currentPhaseId][k]));
    let advancePhase = false;
    let markFailed = false;
    let nextPhaseId: WorkflowPhaseId = currentPhaseId;
    
    console.log(`Phase advancement check - Phase: ${currentPhaseId}, Questions asked: ${questionCounts[currentPhaseId] || 0}, Keys fulfilled: ${expectedKeys.filter(k => Boolean(fulfilled[currentPhaseId][k])).length}/${expectedKeys.length}`);
    
    if (allKeysFulfilled) {
      // All expected outcomes filled - advance to next phase
      console.log('All keys fulfilled, advancing to next phase');
      advancePhase = true;
      nextPhaseId = (workflow.find(p => p.id === currentPhaseId)!.next_state as WorkflowPhaseId);
    } else if (questionCounts[currentPhaseId] >= 3) {
      // Hit 3-question limit but not all outcomes filled - mark as failed and advance
      console.log('Hit 3-question limit, marking phase as failed and advancing');
      markFailed = true;
      if (!failedPhases.includes(currentPhaseId)) {
        failedPhases.push(currentPhaseId);
      }
      advancePhase = true;
      nextPhaseId = (workflow.find(p => p.id === currentPhaseId)!.next_state as WorkflowPhaseId);
    } else {
      console.log('Staying in current phase for follow-up question');
    }

    // Improved key labels in more natural Japanese - updated for dynamic questions
    const getKeyLabels = (phaseId: string): Record<string, string> => {
      const baseLabels: Record<string, string> = {
        name: 'お名前',
        education: 'ご出身校や学歴',
        university_activities: '学生時代の取り組み',
        topic: '取り組まれた内容',
        actions: '具体的な行動や取り組み',
        outcome: '成果や結果',
        strength: 'ご自身の強み',
        example: '具体的なエピソード',
        weakness: '課題や改善点',
        coping_strategy: '改善に向けた取り組み',
        personality_type: '周囲からの評価',
        motivation: '志望理由',
        company_choice: '弊社を選ぶ理由',
        company_challenges: '当社の課題と貢献方法',
        connection_to_experience: 'これまでのご経験との関連',
        future_goal: '今後の目標',
        // Industry-specific labels
        assumptions: '仮定',
        structure: '構造化',
        calculation_steps: '計算ステップ',
        sense_check: 'センスチェック',
        insights: '示唆',
        issue_tree: '問題の構造化',
        hypotheses: '仮説',
        prioritization_reason: '優先順位の理由',
        context: '背景情報',
        stakeholders: 'ステークホルダー',
        tactics: '戦術',
        policy_theme: '政策テーマ',
        kpi: 'KPI',
        data_sources: 'データソース',
        method: '手法',
        stress_signs: 'ストレスサイン',
        routines: 'ルーティン',
        safeguards: 'セーフガード',
        // Add more as needed for other industries
      };
      return baseLabels;
    };

    // Extract user's name from fulfilled data for natural conversation
    let userName = '';
    if (fulfilled['self_intro'] && fulfilled['self_intro']['name']) {
      userName = fulfilled['self_intro']['name'];
    }
    
    let interviewerObjective = '';
    if (advancePhase) {
      if (nextPhaseId === 'end') {
        finished = true;
        const nameAddress = userName ? `${userName}さん、` : '';
        interviewerObjective = `${nameAddress}お忙しい中、貴重なお時間をいただき、ありがとうございました。以上で面接を終了させていただきます。`;
      } else {
        const nextPhase = workflow.find(p => p.id === nextPhaseId)!;
        interviewerObjective = nextPhase.prompt;
        // Count question for the new phase we're entering
        questionCounts[nextPhaseId] = (questionCounts[nextPhaseId] || 0) + 1;
        totalQuestionsAsked++;
      }
      currentPhaseId = nextPhaseId;
    } else {
      // Stay in current phase, ask follow-up question for missing expected outcomes
      const missing = expectedKeys.filter(k => !fulfilled[currentPhaseId][k]);
      const targetKey = missing[0];
      const keyLabels = getKeyLabels(currentPhaseId);
      const jpKey = keyLabels[targetKey] || targetKey;
      
      // More natural follow-up questions based on context
      const followUpPhrases = [
        `${jpKey}について、もう少し詳しくお聞かせいただけますでしょうか。`,
        `${jpKey}の部分をもう少し具体的に教えていただけますか。`,
        `${jpKey}について、詳しく伺えますでしょうか。`
      ];
      
      interviewerObjective = followUpPhrases[Math.floor(Math.random() * followUpPhrases.length)];
      // Count question for current phase
      questionCounts[currentPhaseId] = (questionCounts[currentPhaseId] || 0) + 1;
      totalQuestionsAsked++;
    }

    // 2) Dramatically improved interviewer response prompt with proper 敬語 context
    const responsePrompt = `あなたは日本の大手企業の人事部で働く、経験豊富で丁寧な面接官です。

【重要な人物設定】
- 10年以上の面接経験を持つプロフェッショナル
- 応募者に対して常に敬意を払い、適切な敬語を使用
- 威圧的ではなく、応募者がリラックスして話せる雰囲気作りを心がける
- 簡潔で自然な日本語を話す

【現在の面接状況】
${readableHistory || '面接が始まったばかりです。'}

【応募者の最新発言】
「${transcript}」

【あなたの次の発言目的】
${interviewerObjective}

【発言作成の重要なルール】
1. **敬語の使用**: 丁寧語（です・ます）と尊敬語を適切に使い分ける
2. **自然性**: 実際の面接官が話すような、自然で流暢な日本語
3. **簡潔性**: 1つの質問を20-30文字程度で簡潔に
4. **配慮**: 応募者にプレッシャーを与えない優しい言い回し
5. **継続性**: 過去の会話を踏まえ、重複を避ける
6. **専門性**: 面接官として適切な質問の仕方

【出力】
面接官としての次の発言を1文だけ作成してください。挨拶や前置きは不要です。質問内容のみを自然な敬語で述べてください。`;

    const responseResult = await model.generateContent([responsePrompt]);
    let responseText = responseResult.response.text().trim();
    
    // Clean up response text - remove quotes, extra formatting
    responseText = responseText.replace(/^["「『]|["」』]$/g, '').trim();
    
    // Generate TTS audio with improved voice settings for Japanese business context
    const ttsRequest = {
      input: { text: responseText },
      voice: { 
        languageCode: 'ja-JP',
        name: 'ja-JP-Neural2-C', // Professional male voice - good for business context
        ssmlGender: 'MALE' as const
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const,
        speakingRate: 0.95, // Slightly slower for clarity and professionalism
        pitch: -1.0, // Slightly lower pitch for authority
        volumeGainDb: 2.0 // Slight volume boost for clarity
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    
    // Update conversation history with new messages
    const updatedHistory = [
      ...history,
      { role: "user", content: transcript },
      { role: "assistant", content: responseText }
    ];

    // Save workflow state to database - include workflow definition for persistence
    const workflowStateToSave = {
      currentPhaseId,
      questionCounts,
      fulfilled,
      failedPhases,
      finished,
      workflowDefinition: workflow, // Add workflow definition to persist it
      totalQuestionsAsked
    };

    try {
      await saveWorkflowState(
        effectiveInterviewId,
        workflowStateToSave,
        updatedHistory
      );
    } catch (saveError) {
      console.error("Failed to save workflow state:", saveError);
      // Continue with response even if save fails
    }
    
    // Return transcript, response text, and audio
    return NextResponse.json({
      transcript: transcript,
      userTranscript: transcript, // Add this for frontend compatibility
      text: responseText,
      audio: Buffer.from(ttsResponse.audioContent!).toString('base64'),
      mimeType: 'audio/mp3',
      workflowState: workflowStateToSave,
      interviewCompleted: finished
    });

  } catch (error) {
    console.error("Error in interview conversation:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Failed to process conversation: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to process conversation" 
    }, { status: 500 });
  }
}