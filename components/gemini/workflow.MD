[
  {
    "id": "self_intro",
    "prompt": "まずは自己紹介をお願いします。",
    "expected_data": ["name", "education"],
    "next_state": "gakuchika"
  },
  {
    "id": "gakuchika",
    "prompt": "学生時代に力を入れたこと（ガクチカ）について教えてください。何をしたのか、結果どうだったのかも含めて話してください。",
    "expected_data": ["topic", "actions", "outcome"],
    "next_state": "strength"
  },
  {
    "id": "strength",
    "prompt": "あなたの強みについて教えてください。どのような経験を通してその強みを発揮したか、結果どうだったかも教えてください。",
    "expected_data": ["strength", "example", "outcome"],
    "next_state": "weakness"
  },
  {
    "id": "weakness",
    "prompt": "あなたの弱みは何だと思いますか？また、その弱みにどう対応しているかも教えてください。",
    "expected_data": ["weakness", "coping_strategy"],
    "next_state": "industry_motivation"
  },
  {
    "id": "industry_motivation",
    "prompt": "なぜこの業界を志望しているのか教えてください。ご自身の経験やスキルとどう関係しているかも含めて教えてください。",
    "expected_data": ["motivation", "connection_to_experience, future_goal"],
    "next_state": "end"
  },
]
