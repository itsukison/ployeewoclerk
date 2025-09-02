　・コンサル 　・金融 　・メーカー 　・商社 　・IT・通信 　・広告・マスコミ 　・人材・ 　・インフラ・ 　・不動産・建設 

コンサル
[
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
]

金融
[
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
]

メーカー
[
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
]

商社
[
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
]

IT
[
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
]

広告
[
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
]

人材
[
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
]

インフラ
[
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
]

不動産