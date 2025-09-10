import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/client";
import OpenAI from 'openai';
import { canStartESCorrection, trackESUsage } from "@/lib/actions/usage.actions";

// Configure runtime for Vercel
export const runtime = 'nodejs';
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ESAnalysisRequest {
  companyName: string;
  question: string;
  answer: string;
}

interface ESAnalysisResponse {
  overall_score: number;
  match_score: number;
  structure_score: number;
  basic_score: number;
  feedback: string;
}

const generateESAnalysisPrompt = (companyName: string, question: string, answer: string): string => {
  return `あなたは大手企業の人事部長として、10年以上のES選考経験を持つ非常に厳格な採用担当者です。以下のエントリーシートを採用基準に基づいて徹底的に分析し、改善点を詳細かつ厳しく指摘してください。

【企業名】${companyName}
【質問】${question}
【回答】${answer}

以下の3つの観点から、それぞれ400-600文字の詳細な分析を行い、採用基準から見た厳しい評価を提供してください。回答内容を必ず引用して具体的に批評し、抽象的な評価は避けてください。

【求める人材とのマッチ】
このセクションでは、企業が求める人材像との適合度を非常に厳格に評価してください。

企業が求める人材像の分析：
${companyName}はどのような人材を求めているか、具体的な能力・経験・価値観を詳細に分析してください。

ES回答との適合度評価：
- 企業要件との一致点：具体的にどの部分が企業の求める人材像に合致しているか（回答から直接引用して指摘）
- 不足している要素：企業が求める能力・経験・資質のうち、ESに欠けているもの（具体的に何が書かれていないかを指摘）
- 具体性の欠如：抽象的な表現や具体例が不足している部分（回答から直接引用して指摘）
- 独自性の欠如：他の応募者と差別化できていない内容（どの部分が一般的すぎるか具体的に指摘）
- 価値観の不一致：企業文化や理念との齟齬（回答のどの部分が企業文化と合わないか具体的に指摘）

採用判断への影響：
このESが一次選考を通過する可能性を率直に述べ、改善が必要な箇所を優先順位で示してください。

【構成と基本チェック】
このセクションでは、文章構成と基本的な品質を非常に厳格に評価してください。

構成の評価：
- 導入部：質問に対する明確な回答意図が示されているか（回答の冒頭部分を引用して評価）
- 本文：論理的な流れで具体例が展開されているか（論理の飛躍や矛盾がある部分を具体的に指摘）
- 結論：企業への貢献意思や成長意欲が明確に示されているか（結論部分を引用して評価）
- STAR法の活用：状況・課題・行動・結果が明確に示されているか（不足している要素を具体的に指摘）
- 具体性・定量性：数値や具体的な成果が提示されているか（定量的表現の有無を具体的に指摘）

基本チェック：
- 文法・表記：誤字脱字、不適切な敬語使用、文法ミス（具体的な例を引用して指摘）
- 文字数：質問に対して適切な分量か（冗長または不足している部分を指摘）
- 読みやすさ：一文の長さ、段落構成、読み手への配慮（問題のある文を引用して指摘）
- 専門用語：過度に専門的で読み手への配慮が不足していないか（具体例を引用）
- 感情表現：過度に感情的で客観性を欠いていないか（問題のある表現を引用）

致命的な問題：
選考で即落ちする可能性のある重大な問題があれば具体的に指摘してください。

【改善提案】
このセクションでは、具体的な改善案を提示してください。

優先度の高い改善項目：
1. 最も改善が必要な点とその理由（回答から具体的な例を引用）
2. 具体的な書き換え例（改善前→改善後）
3. 企業への印象が変わる理由の説明

文章構造の改善：
- より効果的な導入文の具体例
- 具体例の強化方法（現在の表現を引用し、どう改善すべきか具体的に示す）
- 結論の印象的なまとめ方の具体例

表現の改善：
- 抽象的な表現を具体的にする方法（問題のある表現を引用し、改善例を示す）
- 数値や成果を用いた説得力の向上（どこにどのような数値を入れるべきか具体的に示す）
- 企業への貢献意欲をより強く伝える表現の具体例

採用されやすいESにするための最終アドバイス：
このESを面接で通過するレベルにするための3つの最重要改善点を提示してください。

【数値評価】
以下の6つの観点から、1-10点で非常に厳格に評価してください。平均点は5点とし、7点以上は優れた回答、3点以下は大幅な改善が必要な回答とします。

1. 志望動機の明確さ（1-10点）：企業を志望する理由が明確で説得力があるか
2. 自己PRの具体性（1-10点）：自己PRが具体的なエピソードや数値で裏付けられているか
3. 文章構成（1-10点）：導入・本論・結論の構成が明確で読みやすいか
4. 論理性（1-10点）：主張と根拠が論理的に結びついているか
5. 独自性（1-10点）：他の応募者と差別化できる独自の強みや視点があるか
6. 企業理解度（1-10点）：企業の事業内容や価値観への理解が示されているか

全体評価（100点満点）：上記6項目の合計点数に基づき、1.67を掛けた点数（最大100点）

出力フォーマット（重要）：
必ず次の角括弧の見出しを用いたプレーンテキストのみで出力してください。Markdownの見出し（#や###）、番号付き見出し、箇条書きの先頭記号の見出し化、余計な前置きや後置きは一切使用しないでください。見出しの文言・順序は厳守してください。

【求める人材とのマッチ】
（ここに分析本文を記載）

【構成と基本チェック】
（ここに分析本文を記載）

【改善提案】
（ここに分析本文を記載）

【数値評価】
志望動機の明確さ：X/10
自己PRの具体性：X/10
文章構成：X/10
論理性：X/10
独自性：X/10
企業理解度：X/10
全体評価：XX/100`;
};

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}

export async function POST(request: NextRequest) {
  console.log("ES Analysis API called");
  
  try {
    // Check authentication
    const { userId } = await auth();
    console.log("User ID:", userId);
    
    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ESAnalysisRequest = await request.json();
    console.log("Request body:", { 
      companyName: body.companyName, 
      question: body.question?.substring(0, 50) + "...",
      answerLength: body.answer?.length 
    });
    
    const { companyName, question, answer } = body;

    // Validate input
    if (!companyName || !question || !answer) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    if (answer.length < 50) {
      return NextResponse.json(
        { error: "回答は50文字以上で入力してください" },
        { status: 400 }
      );
    }

    // Check if user has remaining ES corrections
    const usageCheck = await canStartESCorrection();
    if (!usageCheck.canStart) {
      return NextResponse.json(
        { 
          error: `今月のES添削回数の上限（${usageCheck.planLimit}回）に達しました。より多くのES添削を利用するには、プランをアップグレードしてください。`,
          usageInfo: {
            currentUsage: usageCheck.currentUsage,
            planLimit: usageCheck.planLimit,
            remainingCorrections: usageCheck.remainingCorrections
          },
          redirectToBilling: true
        },
        { status: 429 }
      );
    }

    // Track ES usage before creating the record
    try {
      await trackESUsage();
    } catch (usageError) {
      console.error("Error tracking ES usage:", usageError);
      return NextResponse.json(
        { error: "使用量の記録に失敗しました" },
        { status: 500 }
      );
    }

    // Create initial database record
    const { data: esRecord, error: insertError } = await supabaseAdmin
      .from("es_corrections")
      .insert({
        user_id: userId,
        company_name: companyName,
        question: question,
        answer: answer,
        status: "processing"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "データベースエラーが発生しました" },
        { status: 500 }
      );
    }

    try {
      // Call OpenAI API using the SDK
      console.log("Calling OpenAI API...");
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "あなたは経験豊富な就活・転職コンサルタントです。エントリーシートの添削において、建設的で具体的なフィードバックを提供します。"
          },
          {
            role: "user",
            content: generateESAnalysisPrompt(companyName, question, answer)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const feedback = completion.choices[0]?.message?.content;
      console.log("OpenAI response received, feedback length:", feedback?.length);

      if (!feedback) {
        throw new Error("OpenAI response is empty");
      }

      // Extract scores from the feedback (we'll need to generate these based on quality assessment)
      // Since the new prompt doesn't include scores in the text, we'll use AI-generated scores
      // based on quality assessment - implementing stricter grading
      
      // We need to generate scores based on the feedback content
      // For now, we'll use placeholder scores that will be replaced with actual AI assessment
      let match_score = 75;
      let structure_score = 75;
      let basic_score = 75;
      let overall_score = 75;

      // Extract numerical scores from the feedback text
      const scoreRegex = {
        志望動機: /志望動機の明確さ：(\d+)\/10/,
        自己PR: /自己PRの具体性：(\d+)\/10/,
        文章構成: /文章構成：(\d+)\/10/,
        論理性: /論理性：(\d+)\/10/,
        独自性: /独自性：(\d+)\/10/,
        企業理解度: /企業理解度：(\d+)\/10/,
        全体評価: /全体評価：(\d+)\/100/
      };
      
      // Extract scores or use fallback values
       const extractScore = (regex: RegExp, fallback: number): number => {
         const match = feedback.match(regex);
         return match ? parseInt(match[1]) : fallback;
       };
      
      // Get scores from feedback or use fallback random values
      match_score = extractScore(scoreRegex.企業理解度, Math.floor(Math.random() * 25) + 65) * 10; // Scale 1-10 to percentage
      structure_score = extractScore(scoreRegex.文章構成, Math.floor(Math.random() * 25) + 65) * 10;
      basic_score = extractScore(scoreRegex.自己PR, Math.floor(Math.random() * 25) + 65) * 10;
      overall_score = extractScore(scoreRegex.全体評価, Math.round((match_score + structure_score + basic_score) / 3));

      // Update database record with results
      const { error: updateError } = await supabaseAdmin
        .from("es_corrections")
        .update({
          ai_feedback: feedback,
          overall_score: overall_score,
          match_score: match_score,
          structure_score: structure_score,
          basic_score: basic_score,
          scores: {
            overall: overall_score,
            match: match_score,
            structure: structure_score,
            basic: basic_score
          },
          status: "completed"
        })
        .eq("id", esRecord.id);

      if (updateError) {
        console.error("Database update error:", updateError);
        // Don't return error here as we have the analysis, just log it
      }

      return NextResponse.json({
        id: esRecord.id,
        overall_score,
        match_score,
        structure_score,
        basic_score,
        feedback,
        success: true
      });

    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Update database record with error status
      await supabaseAdmin
        .from("es_corrections")
        .update({ status: "failed" })
        .eq("id", esRecord.id);

      // Provide more specific error messages
      let errorMessage = "AI分析中にエラーが発生しました。しばらく時間をおいて再度お試しください。";
      
      if (openaiError instanceof Error) {
        if (openaiError.message.includes('rate_limit')) {
          errorMessage = "現在アクセスが集中しています。しばらく時間をおいて再度お試しください。";
        } else if (openaiError.message.includes('insufficient_quota')) {
          errorMessage = "サービスの利用制限に達しています。管理者にお問い合わせください。";
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("ES analysis error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}