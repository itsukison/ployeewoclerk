import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure runtime for Vercel
export const runtime = 'nodejs';
export const maxDuration = 30;

// Lazy initialization of OpenAI client
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationHistory, workflowState, interviewId } = body;

    if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return NextResponse.json({ error: "Conversation history is required" }, { status: 400 });
    }

    // Create detailed analysis based on actual workflow state and phases
    let workflowAnalysis = '';
    if (workflowState && workflowState.workflowDefinition) {
      // Build dynamic phase analysis based on actual workflow
      const phaseDetails = workflowState.workflowDefinition
        .filter((phase: any) => !phase.is_transition) // Exclude transition phases
        .map((phase: any) => {
          const fulfilledData = workflowState.fulfilled[phase.id] || {};
          const fulfilledKeys = Object.keys(fulfilledData).filter(key => fulfilledData[key]);
          const isFailed = workflowState.failedPhases?.includes(phase.id);
          
          return `- ${phase.id}: ${phase.prompt}
  期待要素: ${Array.isArray(phase.expected_data) ? phase.expected_data.join(', ') : 'N/A'}
  回答済み: ${fulfilledKeys.length > 0 ? fulfilledKeys.join(', ') : 'なし'}
  状態: ${isFailed ? '失敗' : (fulfilledKeys.length > 0 ? '進行中' : '未開始')}`;
        }).join('\n');

      workflowAnalysis = `
**面接進行状況分析:**
- 現在のフェーズ: ${workflowState.currentPhaseId}
- 完了済み回答: ${JSON.stringify(workflowState.fulfilled, null, 2)}
- 失敗フェーズ: ${workflowState.failedPhases?.join(', ') || 'なし'}
- 面接完了状況: ${workflowState.finished ? '完了' : '未完了'}

**実際の面接フェーズ:**
${phaseDetails}
`;
    } else if (workflowState) {
      // Fallback to original hardcoded analysis if no workflow definition
      workflowAnalysis = `
**面接進行状況分析:**
- 現在のフェーズ: ${workflowState.currentPhaseId}
- 完了済み回答: ${JSON.stringify(workflowState.fulfilled, null, 2)}
- 失敗フェーズ: ${workflowState.failedPhases?.join(', ') || 'なし'}
- 面接完了状況: ${workflowState.finished ? '完了' : '未完了'}

**フェーズ別期待要素:**
- self_intro: 名前、学歴、学生時代の活動
- industry_motivation: 志望動機、会社選択理由、課題認識/将来目標
- gakuchika: 学生時代の取り組み、行動、結果
- strength: 強み、具体例、成果
- weakness: 弱み、対処法
- personality: 周囲からの評価、具体例、成果
`;
    }

    const prompt = `
あなたは経験豊富な面接官です。以下の面接トランスクリプトと構造化されたワークフロー状況を分析し、詳細なフィードバックを提供してください。

${workflowAnalysis}

**評価体系:**
1. **総合評価** - 面接全体のパフォーマンス (100点満点)
2. **チャート用5項目評価** - レーダーチャート表示用の5つの側面 (各10点満点)
3. **フェーズ別評価** - 面接の各段階での具体的評価 (各10点満点)
4. **改善・強み分析** - 具体的な改善点と強みのハイライト

**厳格な採点基準:**
- **0-1点**: 非常に悪い回答 - 質問に適切に答えられていない、内容が不十分、論理性がない、就職の面接には明らかに不適切な回答
- **2-3点**: 平均以下の回答 - 質問には適切に答えられているが、内容が不十分、論理性に欠ける
- **4-5点**: 平均的な回答 - 基本的な要素は含まれている、質問には答えられているが、深みや具体性に欠ける
- **6-7点**: 平均以上の回答 - 具体的で論理的、質問に適切に答えている
- **8-9点**: 優秀な回答 - 非常に詳細で、要点を押さえ、優れた表現力がある
- **10点**: 完璧な回答 - 最高レベルの回答、模範的で印象的、完璧な構成と内容
- **言いよどみペナルティ**: 「ええと、」「えっと、」「えと、」「え、」「ええ、」「あの、」「その、」等の言いよどみは全フェーズの評価に悪影響を与える

**personality phase特別処理:**
- personality phaseが含まれている場合、その評価内容を「強み・弱み」セクションの代わりに使用
- personality phaseの回答から強みと弱みの両方を分析して表示

**出力形式:**
以下の形式の単一のJSONオブジェクトを返してください。
{
  "overallFeedback": {
    "score": "総合点数 (1-100)",
    "feedback": "面接全体に対する包括的なフィードバック (日本語で7〜10文、具体的な強み、改善点、アドバイスを含む)"
  },
  "chartData": [
    { "criteria": "フェーズ1名", "score": 0 },
    { "criteria": "フェーズ2名", "score": 0 },
    { "criteria": "フェーズ3名", "score": 0 },
    { "criteria": "フェーズ4名", "score": 0 },
    { "criteria": "フェーズ5名", "score": 0 }
  ],
  "phaseAnalysis": [
    { "phase": "フェーズ1名", "score": 0, "feedback": "日本語3〜4文" },
    { "phase": "フェーズ2名", "score": 0, "feedback": "日本語3〜4文" },
    { "phase": "フェーズ3名", "score": 0, "feedback": "日本語3〜4文" },
    { "phase": "フェーズ4名", "score": 0, "feedback": "日本語3〜4文" },
    { "phase": "フェーズ5名", "score": 0, "feedback": "日本語3〜4文" }
  ],
  "improvements": [
    "改善すべき具体的なポイント1 (詳細な説明)",
    "改善すべき具体的なポイント2 (詳細な説明)",
    "改善すべき具体的なポイント3 (詳細な説明)"
  ],
  "strengths": [
    "評価できる強み1 (具体的な根拠)",
    "評価できる強み2 (具体的な根拠)",
    "評価できる強み3 (具体的な根拠)"
  ]
}

**重要な注意事項:**
- chartDataとphaseAnalysisの両方で、日本語のフェーズ名を使用してください
- 実際に行われたフェーズのみを評価してください（上記のワークフロー分析を参考にしてください）
- フェーズ名は以下の日本語名を使用してください:
  - "self_intro" → "自己紹介"
  - "industry_motivation" → "志望動機"
  - "gakuchika" → "ガクチカ"
  - "strength" → "強み"
  - "weakness" → "弱み"
  - "personality" → "人柄・人間性"
  - 業界固有質問 → "業界固有質問"
- chartDataのスコアとphaseAnalysisのスコアは全く同じ値にしてください (0-10スケール)
- フェーズが5つ未満の場合は、実際に行われたフェーズのみを含めてください

**面接記録:**
${conversationHistory.map((msg: { role: string; content: string }) => 
  msg.role === "user" 
    ? `【候補者】: ${msg.content}` 
    : `【面接官】: ${msg.content}`
).join('\n')}

**面接内容:**
AI面接官が応募者の情報に基づいて動的に生成した質問による面接
`;

    const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "あなたは経験豊富な面接官で、候補者の回答を的確に評価し、具体的なフィードバックを提供する専門家です。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" },
    }, {
        timeout: 25000, // 25 seconds timeout
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    // Calculate overall score as sum of phase scores times 2
    let calculatedOverallScore = 0;
    if (result.phaseAnalysis && Array.isArray(result.phaseAnalysis)) {
      const totalPhaseScore = result.phaseAnalysis.reduce((sum: number, phase: any) => {
        const score = typeof phase.score === 'string' ? parseFloat(phase.score) : phase.score;
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      
      // Simply multiply by 2 (5 phases * max 10 points each * 2 = 100 max)
      calculatedOverallScore = Math.round(totalPhaseScore * 2);
    }
    
    // Ensure the score is within 0-100 range
    calculatedOverallScore = Math.max(0, Math.min(100, calculatedOverallScore));
    
    // Update the overallFeedback score with calculated value
    const updatedResult = {
      ...result,
      overallFeedback: {
        ...(result.overallFeedback || {}),
        score: calculatedOverallScore.toString()
      }
    };
    
    return NextResponse.json({ 
      overallFeedback: updatedResult.overallFeedback || {},
      chartData: updatedResult.chartData || [],
      phaseAnalysis: updatedResult.phaseAnalysis || [],
      improvements: updatedResult.improvements || [],
      strengths: updatedResult.strengths || [],
      // Keep legacy format for backward compatibility
      detailedFeedback: updatedResult.detailedFeedback || {},
      feedback: updatedResult.feedback || []
    });

  } catch (error) {
    console.error("Error in generate-feedback route:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json({ 
          error: "Request timeout. Please try again." 
        }, { status: 408 });
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          error: "API configuration error" 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: `Failed to generate feedback: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to generate feedback" 
    }, { status: 500 });
  }
}