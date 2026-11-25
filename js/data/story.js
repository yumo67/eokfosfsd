// 夜光カルテ / Yakō Karte — story data
// line: { who, emo?, t:{ja,en,ru} }
// Developer: y_yumo67

const L = (who, ja, en, ru, emo) => (emo ? { who, emo, t: { ja, en, ru } } : { who, t: { ja, en, ru } });
const t = (ja, en, ru) => ({ ja, en, ru });
const E = (ja, en, ru, emo = "normal") => L("emrys", ja, en, ru, emo);
const R = (ja, en, ru) => L("rin", ja, en, ru);
const O = (ja, en, ru) => L("oda", ja, en, ru);
const K = (ja, en, ru) => L("kai", ja, en, ru);
const S = (ja, en, ru) => L("sato", ja, en, ru);
const B = (ja, en, ru) => L("tsubu", ja, en, ru);
const N = (ja, en, ru) => L("narr", ja, en, ru);
const U = (ja, en, ru) => L("unknown", ja, en, ru);

export const NAMES = {
  emrys: t("エムリス", "Emrys", "Эмрис"),
  rin: t("リン", "Rin", "Рин"),
  oda: t("小田ひなた", "Hinata Oda", "Хината Ода"),
  kai: t("カイ", "Kai", "Кай"),
  sato: t("佐藤ベルトラン", "Bertrand Sato", "Бертран Сато"),
  tsubu: t("ツブ", "Tsubu", "Цубу"),
  narr: t("", "", ""),
  unknown: t("？？？", "???", "???"),
};

// ───────────────────────── PROLOGUE ─────────────────────────
const PROLOGUE = [
  N("午前二時。夜間診療所「夜光」には、今夜も明かりがついている。",
    "2 a.m. The lights of Yakō Night Clinic are on again tonight.",
    "Два часа ночи. В ночной клинике «Якō» снова горит свет."),
  N("ほかの病院で断られた人が、最後にたどり着く場所。",
    "The place people end up when every other hospital has turned them away.",
    "Место, куда приходят те, кому отказали во всех других больницах."),
  R("センセー！ おはようございます！ ……って、夜ですけど。",
    "Sensei! Good morning! ...Well. Good night. Whatever.",
    "Сэнсэй! Доброе утро! ...Ну, то есть ночь. Неважно."),
  E("……おはよう。", "...Morning.", "...Доброе."),
  R("今日も顔色、最悪ですね！ いい意味で！",
    "You look terrible again today! In a good way!",
    "Выглядите сегодня ужасно! В хорошем смысле!"),
  E("いい意味の最悪はない。", "There's no good way to look terrible.", "Ужасно в хорошем смысле не бывает.", "annoyed"),
  R("差し入れのメロンパンです。半分こしましょ。あ、私もう半分食べたんで、残りの半分の半分です。",
    "I brought melon bread. Let's split it. Oh, I already ate half, so this is half of the other half.",
    "Я принесла булочку. Давайте пополам. Ой, половину я уже съела, так что это половина от половины."),
  E("……四分の一か。ありがとう。", "...A quarter, then. Thanks.", "...Четвертинка, значит. Спасибо."),
  N("受付の時計が、カチ、と鳴った。", "The reception clock gave a small click.", "Часы в приёмной тихо щёлкнули."),
  R("今夜の患者さんは三人です。小田さん、カイくん、佐藤さん。",
    "Three patients tonight. Mrs. Oda, little Kai, and Mr. Sato.",
    "Сегодня трое пациентов. Госпожа Ода, малыш Кай и господин Сато."),
  E("知ってる。……昨日もそう言ってた。", "I know. ...You said that yesterday too.", "Знаю. ...Ты и вчера так говорила.", "think"),
  R("え？ 言いましたっけ？ まあいっか！",
    "Huh? Did I? Eh, whatever!",
    "А? Правда? Ну и ладно!"),
  R("あ、休憩室のツブにもごはんあげてくださいね。さっきから瓶の中で暴れてます。",
    "Oh, and please feed Tsubu in the break room. It's been rattling around in its bottle for a while.",
    "Ах да, покормите Цубу в комнате отдыха. Он там уже давно буянит в своей баночке."),
  B("ツブはおなかぺこぺこ！ 院長ツブ、栄養失調で殉職寸前！",
    "Tsubu is starving! Chief Physician Tsubu is about to die in the line of duty from malnutrition!",
    "Цубу голоден! Главврач Цубу вот-вот погибнет на посту от истощения!"),
  E("……殉職はしない。プリンはある。", "...Nobody's dying in the line of duty. There's pudding.", "...Никто не погибнет. Пудинг есть."),
  R("じゃあ今夜もよろしくお願いします！ 朝まで、がんばりましょ！",
    "Okay, let's do our best tonight! All the way till morning!",
    "Ну что, работаем! До самого утра!"),
  E("……ああ。朝まで。", "...Yeah. Till morning.", "...Да. До утра."),
  N("時計の針は、三時三十三分を指していた。",
    "The clock hands pointed to 3:33.",
    "Стрелки часов показывали 3:33."),
];

// ───────────────────────── NIGHTS ─────────────────────────
const NIGHTS = [
  // ═════ NIGHT 1 ═════
  {
    id: 1,
    title: t("第一夜　平和な予感", "Night 1: A Peaceful Hunch", "Ночь 1. Предчувствие тишины"),
    intro: [
      N("病棟の明かりは、ホットミルクみたいな色をしている。",
        "The ward lights are the color of warm milk.",
        "Свет в палате цвета тёплого молока."),
      R("センセー、今夜は平和な予感がします！ 私の勘、当たるんですよ。三割くらい。",
        "Sensei, I have a feeling tonight will be peaceful! My hunches are always right. About thirty percent of the time.",
        "Сэнсэй, у меня предчувствие, что ночь будет спокойной! Моя интуиция всегда права. Процентов на тридцать."),
      E("……七割は外れるのか。", "...So seventy percent wrong.", "...То есть на семьдесят ошибается.", "think"),
      R("細かいことは気にしない！ 患者さんたち、もう起きてますよ。夜型なんです、みんな。",
        "Don't sweat the details! The patients are already up. They're all night owls.",
        "Не придирайтесь! Пациенты уже не спят. Они тут все совы."),
      E("……俺もだ。望んでないけど。", "...So am I. Not by choice.", "...Я тоже. Не по своей воле."),
    ],
    tasks: [
      {
        id: "n1_oda", who: "oda", room: "ward", minigame: "diagnosis",
        title: t("小田さんの胸の痛み", "Mrs. Oda's Chest Pain", "Боль в груди у госпожи Оды"),
        pre: [
          O("先生、夜分にすみません。少し胸が苦しくて……。",
            "Doctor, I'm sorry to bother you so late. My chest feels a little tight...",
            "Доктор, простите, что так поздно. В груди немного давит..."),
          E("診ます。座ったままでいいです。", "Let me take a look. You can stay seated.", "Давайте посмотрим. Можно сидя."),
          O("息子が明日来るものですから、それまでにマフラーを編み上げたくて。つい、根を詰めてしまって。",
            "My son is visiting tomorrow, you see. I want to finish this scarf before he comes, so I've been overdoing it.",
            "Завтра приедет мой сын. Хочу успеть довязать ему шарф, вот и засиделась."),
          E("……編み物は逃げません。", "...The knitting won't run away.", "...Вязание никуда не убежит."),
          O("ふふ。先生はおやさしいのね。", "Hehe. You're very kind, Doctor.", "Хи-хи. Вы такой добрый, доктор."),
          E("普通です。……深呼吸を。", "Just normal. ...Deep breath, please.", "Обычный. ...Глубокий вдох, пожалуйста."),
        ],
        success: [
          E("疲労と、軽い脱水です。水分をとって、今夜は早めに休んでください。",
            "Fatigue and mild dehydration. Drink some water and rest early tonight.",
            "Переутомление и лёгкое обезвоживание. Пейте воду и ложитесь пораньше."),
          O("はい。……明日に、間に合いますかねえ。", "Yes, Doctor. ...Do you think I'll make it in time for tomorrow?", "Хорошо. ...Как думаете, к завтрашнему дню успею?"),
          E("……間に合います。", "...You'll make it.", "...Успеете.", "think"),
          N("編みかけのマフラーは、ベッドの端から床まで届くほど長かった。",
            "The unfinished scarf was long enough to reach from the bed to the floor.",
            "Недовязанный шарф свисал с кровати до самого пола."),
        ],
        fail: [
          E("……違うな。もう一度診る。", "...That's not it. Let me check again.", "...Не то. Посмотрю ещё раз.", "think"),
          O("ゆっくりで大丈夫ですよ、先生。夜は長いですから。",
            "Take your time, Doctor. The night is long.",
            "Не торопитесь, доктор. Ночь длинная."),
        ],
      },
      {
        id: "n1_kai", who: "kai", room: "ward", minigame: "disinfect",
        title: t("カイの擦り傷", "Kai's Scraped Knee", "Ссадина Кая"),
        pre: [
          K("ねえねえ先生！ 先生ってオバケ？", "Hey hey, Doctor! Are you a ghost?", "Эй, доктор! А вы привидение?"),
          E("違う。……たぶん。", "No. ...Probably.", "Нет. ...Наверное."),
          K("たぶんって何！？", "What do you mean, probably?!", "Что значит «наверное»?!"),
          E("膝を見せて。廊下、走っただろ。", "Show me your knee. You were running in the hall.", "Покажи колено. Ты бегал по коридору."),
          K("走ってない！ 飛んでた！", "I wasn't running! I was flying!", "Я не бегал! Я летал!"),
          K("しみる？ しみないって言って！", "Will it sting? Say it won't sting!", "Щипать будет? Скажите, что не будет!"),
          E("しみる。", "It'll sting.", "Будет."),
          K("正直すぎ！", "Too honest!", "Слишком честно!"),
        ],
        success: [
          K("……あれ？ 思ったより、へいき。", "...Huh? That wasn't so bad.", "...О? Не так уж и больно."),
          E("よく我慢した。", "You did well.", "Молодец, потерпел."),
          K("お礼に先生の絵、描いてあげる！ 明日見せるね！", "I'll draw you a picture as a thank-you! I'll show you tomorrow!", "В благодарность нарисую вас! Завтра покажу!"),
          E("……楽しみにしてる。", "...I'll look forward to it.", "...Буду ждать."),
        ],
        fail: [
          K("いたたた！ 先生ヘタっぴ！", "Ow ow ow! You're bad at this!", "Ай-ай-ай! Вы не умеете!"),
          E("……もう一回。今度はやさしくやる。", "...Once more. Gentler this time.", "...Ещё раз. Теперь осторожнее."),
        ],
      },
      {
        id: "n1_rin", who: "rin", room: "pharmacy", minigame: "sort",
        title: t("薬棚ドミノ事件", "The Pharmacy Domino Incident", "Аптечное домино"),
        pre: [
          R("センセー、緊急事態です。薬棚、ぐちゃぐちゃにしちゃいました。",
            "Sensei, emergency. I wrecked the medicine shelves.",
            "Сэнсэй, чрезвычайная ситуация. Я разгромила аптечные полки."),
          E("……どうやって。", "...How.", "...Как."),
          R("くしゃみしたら、こう、ドミノ的に。", "I sneezed, and then it went, like, domino-style.", "Я чихнула, и всё посыпалось. Как домино."),
          E("ドミノ的に。", "Domino-style.", "Как домино.", "crossed"),
          R("並べ直すの手伝ってください！ 色とラベルで分けるだけです！ たぶん！",
            "Help me put them back! You just sort them by color and label! Probably!",
            "Помогите разложить! Просто по цвету и этикеткам! Наверное!"),
        ],
        success: [
          R("さっすがセンセー！ 昼のシフトの子にも見せてあげたいなー。",
            "That's our Sensei! I wish the day shift girl could see this.",
            "Вот это Сэнсэй! Показать бы дневной смене."),
          E("昼の子って、誰だ。", "Who's the day shift girl?", "Кто там в дневной смене?"),
          R("え？ ほら、あの……ええと。……まあ、誰かです！",
            "Huh? You know, the... um. ...Well, somebody!",
            "А? Ну эта... как её. ...Ну, кто-то!"),
          E("……そうか。", "...I see.", "...Понятно.", "think"),
        ],
        fail: [
          R("あっ、それ胃薬じゃなくて目薬です！ 目に胃薬はダメです！",
            "Ah, that's eye drops, not stomach medicine! No stomach medicine in eyes!",
            "Ой, это не желудочное, это глазные капли! Желудочное в глаза нельзя!"),
          E("……知ってる。やり直す。", "...I know. Redoing it.", "...Знаю. Переделаю.", "annoyed"),
        ],
      },
    ],
    outro: [
      R("おつかれさまでした！ ね、平和だったでしょ？",
        "Good work tonight! See? It was peaceful!",
        "Отличная работа! Ну что, спокойно ведь было?"),
      E("……三割が当たったな。", "...Your thirty percent came through.", "...Твои тридцать процентов сработали."),
      R("じゃあ、また明日！ センセーはちゃんと寝てくださいね！",
        "See you tomorrow! And you get some actual sleep, okay?",
        "До завтра! И поспите нормально, ладно?"),
      N("窓の外は、まだ暗い。", "Outside the window, it's still dark.", "За окном всё ещё темно."),
      E("……朝は、まだか。", "...Still not morning.", "...Утро всё не наступает.", "ponder"),
      N("時計は三時三十三分。さっきも、そうだった気がする。",
        "The clock says 3:33. It feels like it said that earlier, too.",
        "Часы показывают 3:33. Кажется, и раньше показывали столько же."),
    ],
  },

  // ═════ NIGHT 2 ═════
  {
    id: 2,
    title: t("第二夜　止まった時計", "Night 2: The Stopped Watch", "Ночь 2. Остановившиеся часы"),
    intro: [
      R("センセー聞いてください。佐藤さんが今夜だけでナースコール十七回押しました。",
        "Sensei, listen. Mr. Sato has pressed the nurse call seventeen times tonight already.",
        "Сэнсэй, послушайте. Господин Сато за эту ночь нажал кнопку вызова семнадцать раз."),
      E("十七回。", "Seventeen.", "Семнадцать."),
      R("内訳は「今何時だ」が十六回、「お茶がぬるい」が一回です。",
        "Breakdown: sixteen 'What time is it?' and one 'The tea is lukewarm.'",
        "Из них шестнадцать раз «Который час?» и один раз «Чай остыл»."),
      E("……腕時計、持ってるだろ。", "...He has a wristwatch.", "...У него же есть наручные часы.", "crossed"),
      R("止まってるんですって。三時三十三分で。",
        "It's stopped, apparently. At 3:33.",
        "Говорит, остановились. На 3:33."),
      E("……受付の時計と同じだな。", "...Same as the reception clock.", "...Как часы в приёмной.", "wary"),
      R("ほんとだ！ おそろいですね！", "Oh, you're right! They match!", "И правда! Одинаковые!"),
    ],
    tasks: [
      {
        id: "n2_sato", who: "sato", room: "ward", minigame: "monitor",
        title: t("佐藤さんの心電図", "Mr. Sato's ECG", "ЭКГ господина Сато"),
        pre: [
          S("先生、私は忙しいんだ。朝一番で会議がある。手短に頼む。",
            "Doctor, I'm a busy man. I have a meeting first thing in the morning. Make it quick.",
            "Доктор, я занятой человек. У меня утром совещание. Побыстрее, пожалуйста."),
          E("心電図をつけます。動かないで。", "I'm attaching the ECG. Don't move.", "Подключаю ЭКГ. Не двигайтесь."),
          S("今、何時だ。", "What time is it?", "Который час?"),
          E("……三時三十三分です。", "...3:33.", "...3:33."),
          S("私の時計と同じだな。なら、この時計は合っている。",
            "Same as my watch. Then my watch is correct.",
            "Как на моих часах. Значит, они идут правильно."),
          E("……そうですね。", "...I suppose so.", "...Видимо, да.", "think"),
        ],
        success: [
          E("脈は安定してます。少し速いけど。", "Your pulse is stable. A little fast.", "Пульс стабильный. Немного частый."),
          S("当然だ。私は常に急いでいる。", "Naturally. I'm always in a hurry.", "Разумеется. Я всегда спешу."),
          E("急がなくていいです。……ここでは。", "You don't need to hurry. ...Not here.", "Здесь можно не спешить. ...Здесь — нет."),
          S("……妙なことを言う医者だ。", "...You're an odd sort of doctor.", "...Странный вы врач."),
          E("よく言われます。", "I get that a lot.", "Мне часто это говорят."),
        ],
        fail: [
          E("波形が乱れた。……もう一度見る。", "The waveform's messy. ...Checking again.", "Кривая сбилась. ...Посмотрю ещё раз.", "think"),
          S("早くしてくれ。……いや、別に、急がなくてもいいが。",
            "Hurry up. ...Well. I suppose there's no real rush.",
            "Поторопитесь. ...Хотя, впрочем, спешить некуда."),
        ],
      },
      {
        id: "n2_kai", who: "kai", room: "pharmacy", minigame: "lab",
        title: t("カイの血液検査", "Kai's Blood Test", "Анализ крови Кая"),
        pre: [
          K("先生！ ぼくの血、顕微鏡で見たい！", "Doctor! I want to see my blood under the microscope!", "Доктор! Хочу посмотреть свою кровь в микроскоп!"),
          E("検査はする。見せるのは……少しだけ。", "I'm running the test. You can look... a little.", "Анализ сделаю. Покажу... немножко."),
          K("やったー！ ねえ、オバケの血って何色？", "Yesss! Hey, what color is ghost blood?", "Ура! А какого цвета кровь у привидений?"),
          E("知らない。会ったことない。", "No idea. Never met one.", "Не знаю. Не встречал."),
          K("ふーん。じゃあ先生の血は？", "Hmm. Then what about your blood?", "Хм. А у вас какая кровь?"),
          E("……赤だと思う。最近見てないけど。", "...Red, I think. Haven't seen it in a while.", "...Красная, наверное. Давно не видел.", "ponder"),
        ],
        success: [
          E("数値は正常。元気すぎるくらいだ。", "Everything's normal. If anything, you're too healthy.", "Всё в норме. Даже слишком здоров."),
          K("あ、そうだ！ 見て見て、きのう言ってた絵、できた！",
            "Oh yeah! Look look, I finished the picture I told you about!",
            "А, точно! Смотрите, я дорисовал тот рисунок!"),
          N("クレヨンで描かれた先生。白衣、眠そうな目、ぼさぼさの髪。足もとに、影がない。",
            "A crayon Emrys. White coat, sleepy eyes, messy hair. No shadow at his feet.",
            "Эмрис, нарисованный мелками. Белый халат, сонные глаза, взъерошенные волосы. Под ногами — нет тени."),
          E("……影、描き忘れたか。", "...Forgot the shadow?", "...Тень забыл нарисовать?"),
          K("ううん。ちゃんと見て描いたよ？", "Nope. I drew exactly what I saw.", "Не-а. Я рисовал, как видел."),
          E("……そうか。", "...I see.", "...Понятно.", "wary"),
        ],
        fail: [
          K("先生、それぼくのジュースだよ。", "Doctor, that's my juice.", "Доктор, это мой сок."),
          E("……サンプルを取り直す。", "...Getting a new sample.", "...Возьму образец заново.", "annoyed"),
        ],
      },
      {
        id: "n2_oda", who: "oda", room: "ward", minigame: "cpr",
        title: t("毛糸玉の音", "The Sound of Yarn", "Звук клубка"),
        pre: [
          N("病棟から、毛糸玉が床を転がる音がした。",
            "From the ward came the sound of a ball of yarn rolling across the floor.",
            "Из палаты донёсся звук катящегося по полу клубка."),
          R("センセー！ 小田さんが……！", "Sensei! Mrs. Oda is...!", "Сэнсэй! Госпожа Ода...!"),
          E("……行く。", "...On my way.", "...Иду.", "wary"),
          E("小田さん。聞こえますか。……呼吸なし。脈、触れない。",
            "Mrs. Oda. Can you hear me? ...Not breathing. No pulse.",
            "Госпожа Ода. Вы меня слышите? ...Не дышит. Пульса нет.", "wary"),
          E("胸骨圧迫を始める。リン、時間を。", "Starting compressions. Rin, keep time.", "Начинаю компрессии. Рин, засекай время."),
          R("は、はい！ ……時計、三時三十三分のまま動いてません！",
            "R-right! ...The clock's stuck at 3:33, it's not moving!",
            "Д-да! ...Часы стоят на 3:33, не двигаются!"),
          E("じゃあ声で数えろ。止めるな。", "Then count out loud. Don't stop.", "Тогда считай вслух. Не останавливайся."),
        ],
        success: [
          N("小さく、息を吸う音。", "A small, soft breath.", "Тихий, едва слышный вдох."),
          O("……あら、先生。どうなさったの、そんなお顔で。",
            "...Oh, Doctor. Whatever is the matter? Look at your face.",
            "...Ой, доктор. Что это с вами? Какое у вас лицо."),
          E("……小田さんが、少し寝てただけです。", "...You just dozed off for a bit, that's all.", "...Вы просто ненадолго уснули."),
          O("まあ、ごめんなさいね。夢を見ていたの。息子が、玄関で待っていて……。",
            "Oh dear, I'm sorry. I was dreaming. My son was waiting at the door...",
            "Ох, простите. Мне снился сон. Сын ждал меня у двери..."),
          E("……まだ、こっちにいてください。マフラー、途中でしょう。",
            "...Stay here a while longer. The scarf isn't done yet.",
            "...Побудьте ещё здесь. Шарф ведь не довязан.", "ponder"),
          O("ええ。……そうね。そうでしたね。", "Yes. ...That's right. So it isn't.", "Да. ...Верно. Не довязан."),
        ],
        fail: [
          R("センセー、まだです！ 戻ってきません！", "Sensei, not yet! She's not coming back!", "Сэнсэй, ещё нет! Она не приходит в себя!"),
          E("……もう一度。止めない。", "...Again. I'm not stopping.", "...Ещё раз. Я не остановлюсь.", "wary"),
          R("いち、に、さん、し……！", "One, two, three, four...!", "Раз, два, три, четыре...!"),
        ],
      },
    ],
    outro: [
      R("……センセー。さっき、かっこよかったです。", "...Sensei. You were really cool back there.", "...Сэнсэй. Вы были такой крутой."),
      E("普通だ。", "Just normal.", "Обычный."),
      R("普通の人は、あんな顔しません。", "Normal people don't make a face like that.", "У обычных людей не бывает такого лица."),
      E("……どんな顔。", "...What face.", "...Какого лица."),
      R("自分が倒れたみたいな顔。", "Like you were the one who collapsed.", "Как будто это вы упали."),
      E("……", "......", "......", "ponder"),
      R("あっ、ごめんなさい、変なこと言いました！ プリン食べます？",
        "Ah, sorry, that was a weird thing to say! Want some pudding?",
        "Ой, простите, глупость сказала! Пудинг будете?"),
      E("……ツブの分は残しておけ。", "...Save some for Tsubu.", "...Оставь Цубу."),
      N("佐藤の病室からは、時計の音が聞こえない。今夜も。",
        "No ticking comes from Mr. Sato's room. Not tonight, either.",
        "Из палаты Сато не доносится тиканья. И сегодня тоже."),
    ],
  },

  // ═════ NIGHT 3 ═════
  {
    id: 3,
    title: t("第三夜　わすれもの", "Night 3: Things Left Behind", "Ночь 3. Забытые вещи"),
    intro: [
      R("センセー、今日のお昼って、何してました？", "Sensei, what did you do today? During the day?", "Сэнсэй, а что вы сегодня днём делали?"),
      E("寝てた。……たぶん。", "Slept. ...Probably.", "Спал. ...Наверное."),
      R("「たぶん」多いですね、最近。……私もなんです。お昼のこと、ぜんぜん思い出せなくて。",
        "You've been saying 'probably' a lot lately. ...Me too, actually. I can't remember my days at all.",
        "Вы стали часто говорить «наверное». ...Я тоже. Совсем не помню, что днём делаю."),
      R("家に帰って、ごはん食べて、寝て……のはずなんですけど。うちの玄関のドア、何色だったっけ。",
        "I go home, eat, sleep... I should, anyway. What color was my front door again?",
        "Прихожу домой, ем, сплю... должна, по крайней мере. Какого цвета у меня входная дверь?"),
      E("……疲れてるんだ。", "...You're tired.", "...Ты устала.", "think"),
      R("センセーにだけは言われたくないです！", "You're the last person who gets to say that!", "Уж от вас-то я этого не потерплю!"),
    ],
    tasks: [
      {
        id: "n3_kai", who: "kai", room: "ward", minigame: "suture",
        title: t("窓を見たかった", "He Wanted to See the Window", "Он хотел посмотреть в окно"),
        pre: [
          N("カイがベッドから落ちた。腕に、切り傷。", "Kai fell out of bed. There's a cut on his arm.", "Кай упал с кровати. На руке порез."),
          K("窓の外、見たかったの。朝、見たことないから。",
            "I wanted to look out the window. I've never seen the morning.",
            "Я хотел посмотреть в окно. Я никогда не видел утро."),
          E("……ここに来てから？", "...Since you came here?", "...С тех пор, как попал сюда?"),
          K("ううん。ずっと前から。", "Nope. Since way before that.", "Не-а. Ещё раньше."),
          E("……縫う。少しチクッとする。", "...I'll stitch it. It'll pinch a little.", "...Зашью. Будет немного колоть."),
          K("先生、ぼく泣かないよ。男だから。", "Doctor, I won't cry. 'Cause I'm a boy.", "Доктор, я не буду плакать. Я же мальчик."),
          E("泣いてもいい。男でも。", "You can cry. Boys can cry.", "Можно плакать. Мальчикам тоже."),
        ],
        success: [
          K("もう終わり？ 先生、魔法使い？", "Done already? Are you a wizard?", "Уже всё? Вы волшебник?"),
          E("医者だ。……地味な方の魔法。", "A doctor. ...The boring kind of magic.", "Врач. ...Скучная разновидность магии."),
          K("じゃあ明日、魔法で朝見せて！", "Then tomorrow, use magic and show me the morning!", "Тогда завтра покажите мне утро! Магией!"),
          E("……努力する。", "...I'll try.", "...Постараюсь.", "ponder"),
        ],
        fail: [
          E("……糸がずれた。やり直す。", "...Stitch slipped. Redoing it.", "...Шов сполз. Переделаю.", "annoyed"),
          K("先生、手ふるえてるよ。眠いの？", "Doctor, your hands are shaking. Are you sleepy?", "Доктор, у вас руки дрожат. Спать хотите?"),
          E("いつも眠い。", "Always.", "Всегда."),
        ],
      },
      {
        id: "n3_rin", who: "rin", room: "corridor", minigame: "delivery",
        title: t("廊下の配達", "Corridor Delivery", "Доставка по коридору"),
        pre: [
          R("お薬の配達、お願いしまーす！ 私、なぜか廊下の奥に行くと迷子になるんです。",
            "Medicine delivery, please! For some reason I always get lost at the far end of the corridor.",
            "Разнесите лекарства, пожалуйста! Я почему-то в конце коридора всегда теряюсь."),
          E("廊下は一本だ。", "There's one corridor.", "Коридор один."),
          R("でしょ？ なのに、ドアが一個多い気がして。", "Right? But it feels like there's one door too many.", "Вот именно! А мне кажется, там одна дверь лишняя."),
          E("……どこに。", "...Where.", "...Где.", "wary"),
          R("倉庫の手前の、黒いとこ。……あ、壁か。壁ですよね！",
            "Just before storage, the black part. ...Oh, it's a wall. It's a wall, right?",
            "Перед кладовкой, там, где чёрное. ...А, это стена. Стена ведь, да?"),
          E("……ああ。壁だ。", "...Yeah. It's a wall.", "...Да. Стена."),
        ],
        success: [
          R("ありがとうございます！ 全部届きました？", "Thank you! Did they all get delivered?", "Спасибо! Всё разнесли?"),
          E("……一個余った。宛名がない。", "...One's left over. No name on it.", "...Один остался. Без имени."),
          R("え、誰のだろ。……「4」って書いてあります。四番ベッドって、使ってましたっけ？",
            "Huh, whose is it? ...It says '4.' Is anyone in Bed 4?",
            "А чей? ...Тут написано «4». А четвёртая койка разве занята?"),
          E("……カーテン、閉まってるな。", "...The curtain's closed.", "...Занавеска задёрнута.", "wary"),
        ],
        fail: [
          R("センセー、それ佐藤さんじゃなくて、佐藤さんの時計宛てになってます！",
            "Sensei, that's not addressed to Mr. Sato, it's addressed to Mr. Sato's watch!",
            "Сэнсэй, это не господину Сато, а часам господина Сато!"),
          E("……時計は薬を飲まない。もう一回。", "...Watches don't take medicine. Once more.", "...Часы лекарства не пьют. Ещё раз.", "crossed"),
        ],
      },
      {
        id: "n3_oda", who: "oda", room: "ward", minigame: "memory",
        title: t("息子の名前", "Her Son's Name", "Имя сына"),
        pre: [
          O("先生、ちょっと困ってしまって。", "Doctor, I've gotten myself into a bit of trouble.", "Доктор, у меня небольшая беда."),
          E("どうしました。", "What's wrong?", "Что случилось?"),
          O("息子の名前がね、出てこないの。毎日呼んでいたはずなのに。",
            "I can't remember my son's name. I must have called it every day.",
            "Не могу вспомнить имя сына. А ведь я звала его каждый день."),
          O("マフラーに刺繍しようと思ったら、手が止まってしまって。",
            "I was going to embroider it on the scarf, and my hands just stopped.",
            "Хотела вышить его на шарфе, а руки остановились."),
          E("……一緒に思い出しましょう。順番に。", "...Let's remember it together. One step at a time.", "...Давайте вспомним вместе. По порядку."),
        ],
        success: [
          O("……ああ、そう。そうでした。「ハルキ」。春に生まれたから、ハルキ。",
            "...Oh, yes. That's it. Haruki. He was born in spring, so — Haruki.",
            "...Ах, да. Точно. Харуки. Родился весной, поэтому Харуки."),
          O("ありがとうございます。忘れてしまうなんて、母親失格ね。",
            "Thank you. To forget something like that... what kind of mother am I.",
            "Спасибо вам. Забыть такое... какая же я мать."),
          E("忘れたんじゃない。……少し、遠くに置いただけです。",
            "You didn't forget. ...You just set it down somewhere far away for a bit.",
            "Вы не забыли. ...Просто положили его ненадолго подальше.", "ponder"),
          O("ふふ。先生、詩人ね。", "Hehe. You're quite the poet, Doctor.", "Хи-хи. Да вы поэт, доктор."),
          E("……眠いだけです。", "...Just sleepy.", "...Просто сонный."),
        ],
        fail: [
          O("いいえ……そのお名前ではなかったような。", "No... I don't think that was it.", "Нет... кажется, не так его звали."),
          E("急がなくていい。もう一度。", "No rush. Let's try again.", "Не спешите. Ещё раз."),
        ],
      },
    ],
    outro: [
      N("受付で、面会簿を開く。小田ひなた様への面会者——空欄。",
        "At reception, Emrys opens the guestbook. Visitors for Mrs. Hinata Oda: blank.",
        "В приёмной Эмрис открывает журнал посещений. Посетители Хинаты Оды — пусто."),
      E("……", "......", "......", "ponder"),
      R("センセー？", "Sensei?", "Сэнсэй?"),
      E("小田さんの息子さん、来たことは。", "Has Mrs. Oda's son ever visited?", "Сын госпожи Оды хоть раз приходил?"),
      R("ありますよ！ ……え、ありましたっけ。「明日来る」って毎日言ってるから、なんか、来たような気に……。",
        "Sure he has! ...Wait, has he? She says 'he's coming tomorrow' every day, so it kind of feels like he has...",
        "Конечно! ...Хотя, приходил? Она каждый день говорит «завтра приедет», вот и кажется, что приходил..."),
      E("……そうか。", "...I see.", "...Понятно."),
      N("面会簿の最後のページだけ、インクがまだ乾いていなかった。名前は、書かれていない。",
        "Only the last page of the guestbook had ink that was still wet. No name was written.",
        "Только на последней странице журнала чернила ещё не высохли. Имени там не было."),
    ],
  },

  // ═════ NIGHT 4 ═════
  {
    id: 4,
    title: t("第四夜　夜明けの手前", "Night 4: Just Before Dawn", "Ночь 4. Перед рассветом"),
    intro: [
      N("今夜は、電話がよく鳴る。", "Tonight, the phone keeps ringing.", "Этой ночью телефон звонит без остановки."),
      R("センセー、もう八本目です！ ぜんぶ無言なんですけど、一本だけ「まだですか」って。",
        "Sensei, that's the eighth call! They're all silent, except one that said 'Is it time yet?'",
        "Сэнсэй, уже восьмой звонок! Все молчат, только один спросил: «Ещё не пора?»"),
      E("何が。", "Time for what.", "Пора для чего."),
      R("わかんないです！ 怖いので受付の電話、センセーお願いします！",
        "No idea! It's creepy, so you take the reception phone!",
        "Понятия не имею! Мне страшно, возьмите телефон в приёмной!"),
      E("……医者は電話番じゃない。", "...Doctors aren't receptionists.", "...Врач — не телефонистка.", "annoyed"),
      R("今夜だけ！ プリン二個つけます！", "Just tonight! I'll throw in two puddings!", "Только сегодня! Два пудинга сверху!"),
      E("……ツブに一個。", "...One goes to Tsubu.", "...Один — Цубу."),
    ],
    tasks: [
      {
        id: "n4_calls", who: "rin", room: "reception", minigame: "emergency",
        title: t("鳴りやまない電話", "The Phone That Won't Stop", "Телефон, который не умолкает"),
        pre: [
          R("はいっ、夜光診療所です！ ……センセー、急患です、症状の聞き取りお願いします！",
            "Yes, Yakō Night Clinic! ...Sensei, it's an emergency, please take the details!",
            "Да, ночная клиника «Якō»! ...Сэнсэй, экстренный случай, примите вызов!"),
          E("代わる。……落ち着いて。どこが痛いですか。", "I'll take it. ...Stay calm. Where does it hurt?", "Давай. ...Успокойтесь. Где болит?"),
          U("……くらい。……ずっと、くらい。", "...dark. ...it's been dark... so long.", "...темно. ...всё время... темно."),
          E("……住所を。", "...Your address.", "...Ваш адрес.", "wary"),
          U("……そこ。", "...there.", "...там."),
          R("センセー、次の電話も鳴ってます！ 今度はちゃんとした急患です、たぶん！",
            "Sensei, the next line's ringing! This one's a real emergency, probably!",
            "Сэнсэй, следующий звонок! Этот точно настоящий, наверное!"),
        ],
        success: [
          E("……全部、対応した。", "...That's all of them.", "...Всех принял."),
          R("すごい……！ 最後の人、「ありがとう、先生。シフト、終わるといいね」って言ってました。",
            "Amazing...! The last caller said, 'Thank you, Doctor. I hope your shift ends soon.'",
            "Невероятно...! Последний сказал: «Спасибо, доктор. Надеюсь, ваша смена скоро закончится»."),
          E("……誰だ。", "...Who was it.", "...Кто это был.", "wary"),
          R("番号、出なかったです。", "No number came up.", "Номер не определился."),
        ],
        fail: [
          R("あっ、切れちゃった！", "Ah, they hung up!", "Ой, сбросили!"),
          E("……大丈夫。たぶん、また鳴る。", "...It's fine. It'll probably ring again.", "...Ничего. Наверное, снова позвонят."),
          R("……鳴りました！", "...It's ringing!", "...Звонят!"),
        ],
      },
      {
        id: "n4_sato", who: "sato", room: "ward", minigame: "stethoscope",
        title: t("動き出した時計", "The Watch Starts Ticking", "Часы пошли"),
        pre: [
          S("先生。……時計が、動き出した。", "Doctor. ...My watch has started moving.", "Доктор. ...Мои часы пошли."),
          N("チク、タク。三時三十三分から、三十四分へ。",
            "Tick, tock. From 3:33 to 3:34.",
            "Тик-так. С 3:33 на 3:34."),
          S("何年ぶりだろうな。……いや、おかしいな。止まったのは昨日のはずなんだが。",
            "How many years has it been? ...No, that's strange. It only stopped yesterday.",
            "Сколько же лет прошло? ...Нет, странно. Они ведь только вчера остановились."),
          E("胸の音を聴きます。息を吸って。", "I'm going to listen to your chest. Breathe in.", "Послушаю вас. Вдохните."),
          S("先生。私はずっと、会議に行かなきゃならないと思っていた。だが本当は、娘のピアノの発表会だったんだ。三時半からの。",
            "Doctor. All this time I thought I had a meeting to get to. But it was actually my daughter's piano recital. It started at half past three.",
            "Доктор. Я всё думал, что опаздываю на совещание. А на самом деле — на концерт дочери. Он начинался в половине четвёртого."),
          S("間に合わなかった。……あんなに急いでいたのに。",
            "I didn't make it. ...Even though I was in such a hurry.",
            "Я не успел. ...Хотя так спешил."),
          E("……吸って。吐いて。", "...In. And out.", "...Вдох. Выдох.", "ponder"),
        ],
        success: [
          E("……きれいな音です。もう、急がなくていい。", "...It sounds clear. You don't need to hurry anymore.", "...Чистые тоны. Больше не нужно спешить."),
          S("そうか。……そうか。", "I see. ...I see.", "Вот как. ...Вот как."),
          S("先生。私は、退院かね。", "Doctor. Am I being discharged?", "Доктор. Меня выписывают?"),
          E("……明け方に。", "...At dawn.", "...На рассвете."),
          S("時計が動くなら、今度は遅刻しないな。", "If my watch is running, I won't be late this time.", "Раз часы идут, на этот раз не опоздаю."),
        ],
        fail: [
          E("時計の音で、よく聞こえない。……もう一度。", "The ticking's drowning it out. ...Again.", "Тиканье мешает. ...Ещё раз.", "think"),
          S("外そうか。……いや。外したくないな。すまない。",
            "Shall I take it off? ...No. I'd rather not. I'm sorry.",
            "Снять их? ...Нет. Не хочу снимать. Простите."),
        ],
      },
    ],
    outro: [
      N("窓の外が、ほんの少しだけ白い。", "Outside the window, the sky is just slightly pale.", "За окном небо чуть-чуть побелело."),
      O("先生。マフラー、編み上がりました。", "Doctor. The scarf is finished.", "Доктор. Шарф готов."),
      E("……長いですね。", "...It's long.", "...Длинный."),
      O("ハルキは背が高いから。……それにね、なんだか、私のほうから持っていく気がするの。",
        "Haruki is tall, you know. ...And somehow, I have a feeling I'll be the one bringing it to him.",
        "Харуки высокий. ...И знаете, мне почему-то кажется, что это я сама его отнесу."),
      E("……", "......", "......", "ponder"),
      O("先生にも何か編めばよかったわ。首元、いつも寒そうだもの。",
        "I should have knitted something for you, too. Your neck always looks so cold.",
        "Надо было и вам что-нибудь связать. У вас шея всегда такая озябшая."),
      E("……平気です。", "...I'm fine.", "...Мне не холодно."),
      O("「また明日」は、言わないでおきますね。……ありがとうございました、先生。",
        "I won't say 'see you tomorrow' this time. ...Thank you for everything, Doctor.",
        "Не буду говорить «до завтра». ...Спасибо вам за всё, доктор."),
      S("先生。世話になった。", "Doctor. Thank you for your care.", "Доктор. Благодарю за заботу."),
      S("……君も、あまり急ぐなよ。いや、君は急ぎもしないか。まるで止まっているように見える。",
        "...Don't rush through life either. Though you don't rush at all, do you. You look like you've stopped.",
        "...И вы не торопитесь. Хотя вы и так не торопитесь. Будто остановились."),
      E("……よく言われます。", "...I get that a lot.", "...Мне часто это говорят."),
      S("時計を気にしなくていい朝は、初めてだ。", "It's my first morning without having to check the time.", "Первое утро, когда не нужно смотреть на часы."),
      N("朝には、二人の病室は空になっていた。編み目ひとつ、落ちていない。",
        "By morning, both rooms were empty. Not a single dropped stitch.",
        "К утру обе палаты опустели. Ни одной упавшей петли."),
      R("……センセー。「退院おめでとう」って、言っていいんですよね。",
        "...Sensei. It's okay to say 'congratulations on your discharge,' right?",
        "...Сэнсэй. Ведь можно сказать «поздравляю с выпиской», да?"),
      E("……ああ。言っていい。", "...Yeah. It's okay.", "...Да. Можно."),
      R("じゃあ、おめでとうございます。……なんで泣いてるんだろ、私。",
        "Then... congratulations. ...Why am I crying?",
        "Тогда... поздравляю. ...И почему я плачу?"),
      N("窓は、また暗くなっていた。", "The window had gone dark again.", "Окно снова потемнело."),
    ],
  },

  // ═════ NIGHT 5 ═════
  {
    id: 5,
    title: t("第五夜　四番ベッド", "Night 5: Bed Four", "Ночь 5. Четвёртая койка"),
    intro: [
      R("センセー……今夜は、カイくんだけですね。", "Sensei... it's just Kai tonight.", "Сэнсэй... сегодня только Кай."),
      E("……静かだな。", "...It's quiet.", "...Тихо."),
      R("四番ベッドのカーテン、また閉まってるんです。開けようとすると、手が止まっちゃって。",
        "The curtain on Bed 4 is closed again. Whenever I try to open it, my hand just stops.",
        "Занавеска у четвёртой койки снова задёрнута. Хочу открыть — а рука не поднимается."),
      E("……俺が見る。", "...I'll check it.", "...Я посмотрю.", "wary"),
      K("先生、四番の人、ずっと寝てるよ。先生にそっくりなの。",
        "Doctor, the person in Bed 4 has been asleep forever. They look just like you.",
        "Доктор, человек на четвёртой койке всё время спит. Он прямо как вы."),
      E("……そうか。", "...I see.", "...Вот как.", "ponder"),
    ],
    tasks: [
      {
        id: "n5_bed4", who: "unknown", room: "ward", minigame: "stethoscope",
        title: t("カーテンの向こう", "Behind the Curtain", "За занавеской"),
        pre: [
          N("カーテンの向こうに、誰かが寝ている。白衣を着たまま。",
            "Someone is lying behind the curtain. Still wearing a white coat.",
            "За занавеской кто-то лежит. Прямо в белом халате."),
          E("……失礼します。", "...Excuse me.", "...Прошу прощения.", "wary"),
          N("枕元に、名札が落ちている。かすれた文字で「E. Hale」。",
            "A nametag lies by the pillow. Faded letters: 'E. Hale.'",
            "У подушки лежит бейдж. Выцветшие буквы: «E. Hale»."),
          E("……", "......", "......", "ponder"),
          E("聴診します。", "I'm going to listen.", "Сейчас послушаю."),
          U("……", "......", "......"),
        ],
        success: [
          N("聴診器の向こうは、静かだった。心音も、呼吸音もない。",
            "Through the stethoscope: silence. No heartbeat. No breath.",
            "В стетоскопе — тишина. Ни сердцебиения, ни дыхания."),
          E("……そうか。", "...I see.", "...Вот как.", "ponder"),
          U("……おつかれさま。", "...good work tonight.", "...спасибо за смену."),
          E("……まだ、終わってない。", "...It's not over yet.", "...Ещё не закончилась."),
          N("名札を、そっと元の場所に戻す。", "He quietly sets the nametag back where it was.", "Он тихо кладёт бейдж обратно."),
        ],
        fail: [
          E("……自分の心音しか、聞こえない。", "...All I can hear is my own heartbeat.", "...Слышу только своё сердце.", "wary"),
          E("……本当に、そうか？ もう一度。", "...Is that really true? Once more.", "...Правда ли? Ещё раз.", "ponder"),
        ],
      },
    ],
    outro: [
      K("先生！ 窓、白くなってる！ これ、朝？", "Doctor! The window's turning white! Is this morning?", "Доктор! Окно белеет! Это утро?"),
      E("……たぶん。", "...Probably.", "...Наверное."),
      K("たぶんばっかり！", "Always 'probably'!", "Опять «наверное»!"),
      K("ねえ、絵あげる。先生と、ツブと、リンさん。",
        "Here, this is for you. It's you, Tsubu, and Rin.",
        "Вот, это вам. Тут вы, Цубу и Рин."),
      N("絵の中の先生には、やっぱり影がない。でも今度は、ちゃんと笑っている。",
        "The Emrys in the picture still has no shadow. But this time, he's smiling.",
        "У Эмриса на рисунке по-прежнему нет тени. Но теперь он улыбается."),
      K("先生はオバケじゃないよ。オバケはこんなに眠そうじゃないもん。",
        "You're not a ghost, Doctor. Ghosts aren't this sleepy.",
        "Вы не привидение, доктор. Привидения не бывают такими сонными."),
      E("……そうか。", "...Good to know.", "...Буду знать."),
      K("先生も、いつか朝見てね。約束！", "You have to see the morning someday too, okay? Promise!", "А вы тоже когда-нибудь посмотрите на утро. Обещаете?"),
      E("……ああ。", "...Yeah.", "...Да."),
      K("じゃあね！ 「また明日」じゃなくて——ばいばい！",
        "Bye! Not 'see you tomorrow' — just bye-bye!",
        "Пока! Не «до завтра», а просто — пока-пока!"),
      N("病室には、白いクレヨンが一本だけ残っていた。", "Only a single white crayon was left in the room.", "В палате остался лишь один белый мелок."),
      R("……センセー。帰らないんですか。", "...Sensei. Aren't you going home?", "...Сэнсэй. Вы домой не пойдёте?"),
      E("……患者がいるかもしれない。", "...There might be patients.", "...Могут быть пациенты."),
      R("もう、誰もいませんよ。", "There's no one left.", "Никого уже нет."),
      E("……来るかもしれない。", "...Someone might come.", "...Кто-нибудь может прийти."),
      E("……シフトは、最後までやる。", "...I'll finish the shift.", "...Я доработаю смену."),
      N("時計は、三時三十三分。", "The clock reads 3:33.", "Часы показывают 3:33."),
    ],
  },
];

// ───────────────────────── EPILOGUE ─────────────────────────
const EPILOGUE = [
  R("センセー、おはようございまーす！ ……って、夜ですけど。",
    "Sensei, good morning! ...Well. Good night. Whatever.",
    "Сэнсэй, доброе утро! ...Ну, то есть ночь. Неважно."),
  E("……おはよう。", "...Morning.", "...Доброе."),
  R("今夜も患者さん、来るみたいですよ。ほかで断られちゃった人たち。",
    "Looks like patients are coming tonight too. People who got turned away everywhere else.",
    "Сегодня тоже будут пациенты. Те, кому везде отказали."),
  E("……そうか。", "...I see.", "...Понятно."),
  R("あれ？ このやりとり、前にもしませんでした？", "Huh? Haven't we had this exact conversation before?", "А? Мы же уже так говорили?"),
  E("毎晩してる。", "Every night.", "Каждую ночь."),
  R("じゃあ、毎晩いい夜ってことですね！", "Then every night's a good night!", "Значит, каждая ночь — хорошая!"),
  B("院長ツブ、本日も絶好調！ プリンがあればもっと絶好調！",
    "Chief Physician Tsubu is in top form today! With pudding, even toppier form!",
    "Главврач Цубу сегодня в отличной форме! С пудингом — в ещё отличнейшей!"),
  E("……昨日も言ってたな。", "...You said that yesterday.", "...Ты и вчера так говорил."),
  B("ツブは昨日のこと、ぜーんぶ覚えてる！ 昨日は……プリンだった！",
    "Tsubu remembers EVERYTHING about yesterday! Yesterday was... pudding!",
    "Цубу помнит про вчера ВСЁ! Вчера был... пудинг!"),
  N("四番ベッドのカーテンは、閉じたまま。", "The curtain on Bed 4 stays closed.", "Занавеска у четвёртой койки по-прежнему задёрнута."),
  E("……行くか。", "...Let's go.", "...Пошли."),
  N("シフトは、続く。", "The shift continues.", "Смена продолжается."),
];

// ───────────────────────── DAILY REQUESTS ─────────────────────────
const DAILY = [
  {
    id: "d_rin_sort", who: "rin", minigame: "sort",
    title: t("薬棚の整理", "Shelf Sorting", "Разбор полок"),
    pre: [
      R("センセー、また棚が崩れました！ 今度はくしゃみじゃないです。あくびです。",
        "Sensei, the shelves collapsed again! It wasn't a sneeze this time. It was a yawn.",
        "Сэнсэй, полки опять рухнули! На этот раз не чих. Зевок."),
      E("……あくびで棚は崩れない。", "...Yawns don't knock over shelves.", "...От зевка полки не падают.", "crossed"),
      R("私のは崩れるんです！", "Mine do!", "А от моего падают!"),
    ],
    success: [
      R("ぴかぴか！ センセー、薬剤師にもなれますよ。", "Spotless! You could be a pharmacist too, Sensei.", "Блеск! Вам бы в фармацевты, Сэнсэй."),
      E("これ以上、肩書きはいらない。", "I don't need more job titles.", "Мне хватит должностей."),
    ],
  },
  {
    id: "d_rin_delivery", who: "rin", minigame: "delivery",
    title: t("夜食の配達", "Midnight Snack Run", "Доставка перекуса"),
    pre: [
      R("夜食のおにぎり、病室に配ってきてもらえます？ 梅は私のなので抜いてください。",
        "Could you hand out the midnight rice balls? The plum one's mine, so skip that.",
        "Разнесёте онигири по палатам? С умэ — моё, его не трогайте."),
      E("……梅しか残ってない。", "...There's only plum left.", "...Остались только с умэ."),
      R("えっ。じゃあ……半分こで。", "What. Then... we split it.", "Что. Тогда... пополам."),
    ],
    success: [
      R("配達完了ですね！ お礼にお茶いれます。ぬるめで。", "Delivery complete! I'll make you tea as thanks. Lukewarm.", "Доставка завершена! Сделаю вам чаю. Тёпленького."),
      E("……熱めで。", "...Hot, please.", "...Горячего, пожалуйста."),
    ],
  },
  {
    id: "d_rin_emergency", who: "rin", minigame: "emergency",
    title: t("深夜の電話番", "Late Night Phones", "Ночные звонки"),
    pre: [
      R("電話、また鳴ってます。センセー、出てもらえますか。",
        "The phone's ringing again. Sensei, could you get it?",
        "Телефон опять звонит. Сэнсэй, возьмёте?"),
      R("さっき出たら、自分の声が聞こえた気がして。……気のせいですよね！",
        "When I picked up earlier, I thought I heard my own voice. ...Just my imagination, right?",
        "Когда я ответила, мне показалось, что я слышу свой голос. ...Показалось, да?"),
      E("……出る。", "...I'll answer.", "...Отвечу.", "wary"),
    ],
    success: [
      R("ありがとうございます！ 私、受付なのに電話こわいって、致命的ですよね。",
        "Thank you! A receptionist who's scared of phones. Kind of fatal, huh?",
        "Спасибо! Регистратор, который боится телефона. Это фатально, да?"),
      E("……誰にでも苦手はある。", "...Everyone has something.", "...У всех что-то есть."),
    ],
  },
  {
    id: "d_rin_monitor", who: "rin", minigame: "monitor",
    title: t("リンの健康チェック", "Rin's Checkup", "Осмотр Рин"),
    pre: [
      R("センセー、たまには私も診てください。最近ずっと眠くなくて。",
        "Sensei, check me for once. I haven't felt sleepy at all lately.",
        "Сэнсэй, осмотрите и меня как-нибудь. Я совсем перестала хотеть спать."),
      E("……それは、俺もだ。", "...Same here.", "...Я тоже.", "think"),
      R("おそろいですね！ じゃ、モニターつけまーす。", "We match! Okay, hooking up the monitor.", "Одинаково! Ну, подключаю монитор."),
    ],
    success: [
      E("異常なし。……数字の上では。", "Nothing abnormal. ...On paper.", "Отклонений нет. ...По цифрам."),
      R("数字の上で健康なら、健康です！", "If I'm healthy on paper, I'm healthy!", "Если по цифрам здорова — значит, здорова!"),
    ],
  },
  {
    id: "d_rin_memory", who: "rin", minigame: "memory",
    title: t("リンの忘れもの", "What Rin Forgot", "Что забыла Рин"),
    pre: [
      R("センセー、私の住所って知ってます？ 書類に書こうとしたら、出てこなくて。",
        "Sensei, do you know my address? I was filling out a form and it just... wouldn't come.",
        "Сэнсэй, вы знаете мой адрес? Хотела вписать в бланк, а он не вспоминается."),
      E("……一緒に思い出そう。", "...Let's figure it out together.", "...Давай вспомним вместе.", "ponder"),
    ],
    success: [
      R("あっ、思い出しました！ たぶん！ ……センセー、私、ここに住んでませんよね？",
        "Oh, I remember now! Probably! ...Sensei, I don't live here, do I?",
        "О, вспомнила! Наверное! ...Сэнсэй, я ведь не здесь живу?"),
      E("……休憩室に布団はない。", "...There's no futon in the break room.", "...В комнате отдыха нет футона."),
      R("ですよねー！", "Right?!", "Вот и я о том!"),
    ],
  },
  {
    id: "d_rin_lab", who: "rin", minigame: "lab",
    title: t("謎のサンプル", "The Mystery Sample", "Загадочный образец"),
    pre: [
      R("冷蔵庫に、ラベルのない試験管がありました。誰のだろ。",
        "There was an unlabeled test tube in the fridge. Whose could it be?",
        "В холодильнике пробирка без этикетки. Чья она?"),
      E("調べる。……プリンじゃないといいが。", "I'll check. ...Hopefully not pudding.", "Проверю. ...Надеюсь, не пудинг."),
    ],
    success: [
      E("……ただの生理食塩水だ。", "...Just saline.", "...Обычный физраствор."),
      R("よかったー！ 日付、何年前のだったんだろ。……あれ、日付ありました？",
        "Phew! I wonder how many years old it was. ...Wait, was there a date on it?",
        "Фух! Интересно, сколько ей лет. ...Стоп, там была дата?"),
    ],
  },
  {
    id: "d_rin_disinfect", who: "rin", minigame: "disinfect",
    title: t("紙で指を切った", "Paper Cut", "Порез бумагой"),
    pre: [
      R("いたっ。センセー、カルテで指切りました。カルテって攻撃してくるんですね。",
        "Ow. Sensei, I cut my finger on a chart. Charts fight back, huh.",
        "Ай. Сэнсэй, порезалась о карту. Оказывается, карты кусаются."),
      E("見せて。……浅い。消毒する。", "Let me see. ...Shallow. I'll disinfect it.", "Покажи. ...Неглубоко. Обработаю."),
    ],
    success: [
      R("ありがとうございます！ ……あれ、血、出てなかったですね。",
        "Thank you! ...Huh. It didn't actually bleed.",
        "Спасибо! ...Хм. А крови-то и не было."),
      E("……そうだな。", "...So it didn't.", "...Не было.", "think"),
    ],
  },
  {
    id: "d_oda_diag", who: "oda", minigame: "diagnosis",
    title: t("小田さんの肩こり", "Mrs. Oda's Stiff Shoulders", "Плечи госпожи Оды"),
    pre: [
      O("先生、肩がね、編み物のせいでかちこちなの。", "Doctor, my shoulders are stiff as boards from all the knitting.", "Доктор, у меня от вязания плечи совсем окаменели."),
      E("診ます。……休憩も、治療のうちです。", "Let me see. ...Breaks are part of treatment too.", "Посмотрю. ...Отдых — тоже лечение."),
    ],
    success: [
      O("あら、軽くなったわ。先生、按摩もお上手なのね。", "Oh, that feels lighter. You're good at massage too, Doctor.", "Ой, полегчало. Вы и массаж умеете, доктор."),
      E("……医者です。", "...I'm a doctor.", "...Я врач."),
    ],
  },
  {
    id: "d_oda_sort", who: "oda", minigame: "sort",
    title: t("お薬ケースの仕分け", "Pill Case Mix-up", "Перепутанные таблетки"),
    pre: [
      O("先生、お薬ケースを落としてしまって。朝の分も夜の分も、ぜんぶ混ざってしまったの。",
        "Doctor, I dropped my pill case. Morning, evening — it's all mixed up now.",
        "Доктор, я уронила таблетницу. Утренние, вечерние — всё перемешалось."),
      E("……見せてください。形で分ければ戻せます。", "...Let me see. We can sort them back by shape.", "...Покажите. По форме разберём обратно.", "think"),
      O("助かるわ。わたし、どれが何だか、だんだん分からなくなってきて。", "Thank you. I've been losing track of which is which lately.", "Спасибо. Я в последнее время всё путаю, где какая."),
      E("それは、俺の仕事です。", "That's my job.", "Это моя работа."),
    ],
    success: [
      O("まあ、元通り。先生の手は、迷わないのね。", "Oh, just like before. Your hands never hesitate, Doctor.", "Ой, как было. У вас руки не сомневаются, доктор."),
      E("……迷う暇がないだけです。", "...I just don't have time to.", "...Просто некогда сомневаться."),
      O("ハルキにも、ちゃんと飲んでるって言えるわ。明日。", "Now I can tell Haruki I'm taking them properly. Tomorrow.", "Теперь скажу Харуки, что пью всё как надо. Завтра."),
    ],
  },
  {
    id: "d_kai_suture", who: "kai", minigame: "suture",
    title: t("ぬいぐるみの手術", "Plushie Surgery", "Операция для игрушки"),
    pre: [
      K("先生、くまのムーくんが破れちゃった！ 手術して！",
        "Doctor, Moo the bear got ripped! Do surgery on him!",
        "Доктор, мишка Му порвался! Сделайте ему операцию!"),
      E("……患者は初めての種類だな。", "...New kind of patient.", "...Новый вид пациента.", "think"),
      K("ムーくん、泣かないよ。男だから。", "Moo won't cry. He's a boy.", "Му не будет плакать. Он же мальчик."),
      E("泣いてもいい。くまでも。", "He can cry. Bears can cry.", "Можно плакать. Медведям тоже."),
    ],
    success: [
      K("やったー！ ムーくん、ありがとうって言ってる！", "Yay! Moo says thank you!", "Ура! Му говорит спасибо!"),
      E("……どういたしまして。", "...You're welcome.", "...Пожалуйста."),
    ],
  },
  {
    id: "d_kai_lab", who: "kai", minigame: "lab",
    title: t("カイの自由研究", "Kai's Science Project", "Научный проект Кая"),
    pre: [
      K("先生、自由研究したい！ テーマは「夜はなんで終わらないのか」！",
        "Doctor, I want to do a science project! The topic is 'Why doesn't the night end?'",
        "Доктор, хочу научный проект! Тема: «Почему ночь не заканчивается?»"),
      E("……テーマ、変えないか。", "...How about a different topic?", "...Может, другую тему?", "wary"),
      K("じゃあ「プリンはなんでおいしいのか」！", "Then 'Why is pudding so good?'!", "Тогда «Почему пудинг такой вкусный?»!"),
      E("それにしよう。", "Let's do that one.", "Давай эту."),
    ],
    success: [
      K("結論！ プリンはおいしいからおいしい！", "Conclusion! Pudding is good because it's good!", "Вывод! Пудинг вкусный, потому что вкусный!"),
      E("……学会に出せるな。", "...Publishable.", "...Можно публиковать."),
    ],
  },
  {
    id: "d_kai_memory", who: "kai", minigame: "memory",
    title: t("お絵かきしりとり", "Drawing Game", "Игра в рисунки"),
    pre: [
      K("先生、神経衰弱しよ！ ぼくの絵のカードで！", "Doctor, let's play memory! With my drawing cards!", "Доктор, давайте в «мемори»! С моими рисунками!"),
      E("……一回だけな。", "...One round.", "...Один раунд."),
    ],
    success: [
      K("先生つよい！ でもね、このカード、ペアがいないの。四番の人のカード。",
        "You're good! But this card doesn't have a pair. It's the card for the person in Bed 4.",
        "Вы сильный! Но у этой карточки нет пары. Это карточка человека с четвёртой койки."),
      E("……そうか。", "...I see.", "...Вот как.", "ponder"),
    ],
  },
  {
    id: "d_sato_monitor", who: "sato", minigame: "monitor",
    title: t("佐藤さんの血圧", "Mr. Sato's Blood Pressure", "Давление господина Сато"),
    pre: [
      S("先生、血圧を測ってくれ。会議の前に数字を把握しておきたい。",
        "Doctor, check my blood pressure. I want to know my numbers before the meeting.",
        "Доктор, измерьте давление. Хочу знать цифры перед совещанием."),
      E("……会議はいつですか。", "...When's the meeting?", "...Когда совещание?"),
      S("朝だ。いつもの、朝だ。", "Morning. The usual morning.", "Утром. Как всегда, утром."),
    ],
    success: [
      E("少し高い。深呼吸を。", "A little high. Breathe deeply.", "Немного повышено. Дышите глубже."),
      S("ふむ。……君の言う通りにしよう。今だけは。", "Hm. ...I'll do as you say. Just this once.", "Хм. ...Сделаю, как вы говорите. Только сейчас."),
    ],
  },
  {
    id: "d_sato_delivery", who: "sato", minigame: "delivery",
    title: t("書類の届け物", "Document Delivery", "Доставка документов"),
    pre: [
      S("この書類を、受付に届けてくれないか。至急だ。",
        "Would you take these documents to reception? It's urgent.",
        "Не отнесёте эти бумаги в приёмную? Срочно."),
      E("……白紙ですよ。", "...They're blank.", "...Они пустые.", "think"),
      S("中身は後で考える。至急なのは、届けることだ。",
        "I'll think about the content later. What's urgent is delivering them.",
        "Содержание потом. Срочно — доставить."),
    ],
    success: [
      S("助かった。……で、私は何を届けたかったんだったかな。",
        "Much obliged. ...Now, what was it I wanted to deliver?",
        "Выручили. ...А что я, собственно, хотел передать?"),
    ],
  },
  {
    id: "d_sato_steth", who: "sato", minigame: "stethoscope",
    title: t("時計の音", "The Sound of the Watch", "Звук часов"),
    pre: [
      S("先生。聴診器で、この時計の音も聴いてくれんか。止まっているかどうか。",
        "Doctor. Could you listen to my watch with your stethoscope? To see if it's stopped.",
        "Доктор. Послушайте стетоскопом мои часы. Остановились или нет."),
      E("……時計の聴診は、専門外です。", "...Watch auscultation isn't my specialty.", "...Аускультация часов — не мой профиль.", "crossed"),
      S("そこをなんとか。", "Humor me.", "Ну пожалуйста."),
    ],
    success: [
      E("……何も聞こえません。", "...I can't hear anything.", "...Ничего не слышно."),
      S("そうか。なら、まだ三時三十三分だ。安心した。",
        "I see. Then it's still 3:33. What a relief.",
        "Вот как. Значит, всё ещё 3:33. Какое облегчение."),
    ],
  },
  {
    id: "d_rin_cpr", who: "rin", minigame: "cpr",
    title: t("救命講習", "CPR Practice", "Тренировка СЛР"),
    pre: [
      R("センセー、救命の練習させてください！ 人形、倉庫から出してきました。",
        "Sensei, let me practice CPR! I brought the dummy out of storage.",
        "Сэнсэй, давайте потренируем реанимацию! Я достала манекен из кладовки."),
      R("名前もつけたんです。「ヘイルくん」。", "I even named him. 'Mr. Hale.'", "Я даже имя ему дала. «Господин Хейл»."),
      E("……やめろ。", "...Don't.", "...Не надо.", "annoyed"),
    ],
    success: [
      R("完璧！ ヘイルくん、生き返りました！", "Perfect! Mr. Hale has been revived!", "Идеально! Господин Хейл ожил!"),
      E("……人形だ。", "...It's a dummy.", "...Это манекен.", "crossed"),
    ],
  },
  {
    id: "d_oda_steth", who: "oda", minigame: "stethoscope",
    title: t("夜の聴診", "Night Auscultation", "Ночное прослушивание"),
    pre: [
      O("先生、胸の音、聴いていただけますか。なんだか、静かすぎる気がして。",
        "Doctor, would you listen to my chest? It feels a little too quiet somehow.",
        "Доктор, послушайте, пожалуйста. Мне кажется, там как-то слишком тихо."),
      E("聴きます。……楽にして。", "I'll listen. ...Relax.", "Послушаю. ...Расслабьтесь."),
    ],
    success: [
      E("……ちゃんと、動いてます。", "...It's beating fine.", "...Всё бьётся."),
      O("よかった。まだ、間に合いますね。", "Good. Then I still have time.", "Хорошо. Значит, ещё успею."),
    ],
  },
];

// ───────────────────────── IDLE CONVERSATIONS ─────────────────────────
const IDLE = {
  rin: {
    1: [
      [
        R("センセー、メロンパンの皮だけ食べる派ですか？ 中だけ派ですか？", "Sensei, are you a melon bread crust person or an inside person?", "Сэнсэй, вы у булочки корочку едите или серединку?"),
        E("全部食べる派。", "Whole thing.", "Всю целиком."),
        R("つまんなーい！", "Boooring!", "Скукота!"),
      ],
      [
        R("知ってます？ この診療所、夜しか開いてないのに「夜光」って名前なんですよ。そのまんま！",
          "Did you know? This clinic is only open at night, and it's called 'Nightglow.' So on the nose!",
          "А вы знали? Клиника работает только ночью и называется «Ночной свет». Прямо в лоб!"),
        E("……わかりやすくていい。", "...Clear enough.", "...Зато понятно."),
      ],
      [
        R("センセーって、いつから夜勤なんですか？", "Sensei, how long have you been on nights?", "Сэнсэй, а вы давно в ночную смену?"),
        E("……けっこう前から。", "...A while.", "...Довольно давно.", "think"),
        R("けっこうって、何年？", "A while like how many years?", "Давно — это сколько лет?"),
        E("……数えてない。", "...Haven't counted.", "...Не считал."),
      ],
    ],
    2: [
      [
        R("ツブって、いつからいるんでしょうね。私が来たときにはもう瓶の中にいました。",
          "I wonder how long Tsubu's been here. It was already in the bottle when I came.",
          "Интересно, сколько Цубу тут живёт. Когда я пришла, он уже сидел в банке."),
        E("俺が来たときも、いた。", "It was there when I came too.", "Когда я пришёл, тоже сидел."),
        R("じゃあ、ツブが一番先輩ですね！", "Then Tsubu's the senior staff here!", "Значит, Цубу у нас самый старший!"),
        E("……本人に言うなよ。調子に乗る。", "...Don't tell it that. It'll get a big head.", "...Только ему не говори. Зазнается."),
      ],
      [
        R("センセー、ゴシップです。佐藤さん、昔すごい会社の偉い人だったらしいですよ。",
          "Sensei, gossip time. Apparently Mr. Sato used to be a big shot at some huge company.",
          "Сэнсэй, сплетня. Говорят, господин Сато был большим начальником в крупной фирме."),
        E("……誰に聞いた。", "...Who told you?", "...Кто сказал?"),
        R("佐藤さん本人です。十二回。", "Mr. Sato himself. Twelve times.", "Сам господин Сато. Двенадцать раз."),
      ],
      [
        R("受付のベル、たまに勝手に鳴るんですよね。チン、って。", "The reception bell rings by itself sometimes. Ding.", "Звонок в приёмной иногда звенит сам. Дзынь."),
        E("……風だろ。", "...Wind.", "...Сквозняк."),
        R("窓、開かないですよ？", "The windows don't open, though.", "Окна же не открываются."),
        E("……", "......", "......", "wary"),
      ],
    ],
    3: [
      [
        R("センセー、私の昼のシフト、誰と交代してるか知ってます？",
          "Sensei, do you know who I hand off to on the day shift?",
          "Сэнсэй, а вы знаете, кому я сдаю смену днём?"),
        E("……知らない。会ったことない。", "...No. Never met them.", "...Нет. Не встречал."),
        R("ですよね。私も、です。", "Right. Me neither.", "Вот. Я тоже."),
      ],
      [
        R("知ってます？ 音を全部消すと、ノックが聞こえるんですって。この診療所の怪談です。",
          "Have you heard? If you turn every sound off, you can hear knocking. It's this clinic's ghost story.",
          "Слышали? Если выключить вообще все звуки, можно услышать стук. Местная страшилка."),
        E("……静かすぎるのも、よくないな。", "...Too much quiet isn't good either.", "...Слишком тихо — тоже плохо."),
        R("センセー、怖がってます？", "Sensei, are you scared?", "Сэнсэй, вы боитесь?"),
        E("眠いだけだ。", "Just sleepy.", "Просто сонный."),
      ],
      [
        R("はい、センセー。のど飴。", "Here, Sensei. A throat drop.", "Вот, Сэнсэй. Леденец от горла."),
        E("……のど、痛くない。", "...My throat's fine.", "...Горло не болит."),
        R("いいんです。持っててください。なんか、渡しておきたくて。",
          "That's okay. Just keep it. I just... felt like giving it to you.",
          "Ничего. Просто возьмите. Мне захотелось вам что-нибудь дать."),
      ],
    ],
    4: [
      [
        R("センセー。私、お母さんの声、思い出せないんです。さっき急に気づいて。",
          "Sensei. I can't remember my mom's voice. I just realized it out of nowhere.",
          "Сэнсэй. Я не могу вспомнить мамин голос. Только что вдруг поняла."),
        E("……", "......", "......", "ponder"),
        E("……思い出せなくても、なくなったわけじゃない。", "...Not remembering doesn't mean it's gone.", "...Если не помнишь — это не значит, что его нет."),
        R("……えへへ。センセー、たまにいいこと言いますね。", "...Hehe. You say nice things sometimes, Sensei.", "...Хи-хи. Вы иногда говорите хорошие вещи, Сэнсэй."),
      ],
      [
        R("電話、今夜ほんとに多いですね。みんな、どこに電話してるつもりなんだろ。",
          "So many calls tonight. I wonder where they all think they're calling.",
          "Столько звонков сегодня. Куда они все думают, что звонят?"),
        E("……ここだろ。", "...Here.", "...Сюда."),
      ],
      [
        R("センセー、ちょっとだけ寝てていいですよ。私、見てますから。",
          "Sensei, you can nap for a bit. I'll keep watch.",
          "Сэнсэй, можете немного поспать. Я посторожу."),
        E("……寝ない。", "...I won't sleep.", "...Не буду."),
        R("なんで？", "Why not?", "Почему?"),
        E("……起きられなかったら、困る。", "...It'd be a problem if I didn't wake up.", "...Будет неприятно, если не проснусь.", "think"),
      ],
    ],
    5: [
      [
        R("病棟、静かになっちゃいましたね。", "The ward's gotten so quiet.", "В палате стало так тихо."),
        E("……ああ。", "...Yeah.", "...Да."),
        R("寂しいって言ったら、怒ります？", "Would you be mad if I said I'm lonely?", "Вы рассердитесь, если я скажу, что мне одиноко?"),
        E("怒らない。……俺も、少し。", "No. ...Me too. A little.", "Нет. ...Мне тоже. Немного."),
      ],
      [
        R("センセー、四番ベッドの人のこと、知ってるんですか？", "Sensei, do you know who's in Bed 4?", "Сэнсэй, вы знаете, кто на четвёртой койке?"),
        E("……知ってる気がする。", "...I feel like I do.", "...Кажется, знаю.", "ponder"),
        R("……そっか。じゃあ、聞かないでおきます。", "...Okay. Then I won't ask.", "...Ясно. Тогда не буду спрашивать."),
      ],
    ],
    6: [
      [
        R("センセー、おはようございます！ ……って、毎晩言ってますね、私。",
          "Good morning, Sensei! ...I say that every night, don't I.",
          "Доброе утро, Сэнсэй! ...Я это каждую ночь говорю, да?"),
        E("毎晩聞いてる。", "And I hear it every night.", "А я каждую ночь слушаю."),
        R("飽きました？", "Tired of it?", "Надоело?"),
        E("……いや。", "...No.", "...Нет."),
      ],
      [
        R("新しい患者さん、来るかなあ。来たら、また名前で呼んであげましょうね。",
          "I wonder if new patients will come. When they do, let's call them by their names again.",
          "Интересно, придут ли новые пациенты. Когда придут, будем звать их по именам, ладно?"),
        E("……ああ。", "...Yeah.", "...Да."),
      ],
      [
        R("センセー、窓の外って、ずっと暗いですよね。", "Sensei, it's always dark outside the window, isn't it.", "Сэнсэй, за окном ведь всегда темно."),
        E("……夜勤だからな。", "...It's the night shift.", "...Ночная смена же."),
        R("あはは。そういうことにしときましょ！", "Ahaha. Let's go with that!", "Ха-ха. Пусть будет так!"),
      ],
      [
        R("センセーがいなくなったら、私どうしよう。", "What would I do if you disappeared, Sensei?", "Что я буду делать, если вы исчезнете, Сэнсэй?"),
        E("……シフト中は、いなくならない。", "...I won't disappear mid-shift.", "...Посреди смены не исчезну."),
        R("じゃあ、ずっとシフト中でいてくださいね。", "Then stay on shift forever, okay?", "Тогда будьте на смене всегда, ладно?"),
        E("……努力する。", "...I'll try.", "...Постараюсь.", "ponder"),
      ],
      [
        R("ツブがさっき、「三回、一回、三回」って歌ってました。なんの歌だろ。",
          "Tsubu was singing 'three, one, three' a little while ago. What song is that?",
          "Цубу только что пел «три, один, три». Что это за песня?"),
        E("……さあ。トントントン、か。", "...No idea. Tap-tap-tap, maybe.", "...Не знаю. Тук-тук-тук, может.", "think"),
      ],
    ],
  },

  oda: {
    1: [
      [
        O("先生、このマフラー、何色がいいと思います？ ハルキは赤が好きなの。", "Doctor, what color do you think suits this scarf? Haruki likes red.", "Доктор, какой цвет лучше для шарфа? Харуки любит красный."),
        E("……赤で、いいと思います。", "...Red sounds good.", "...Красный подойдёт."),
        O("先生は？ 何色がお好き？", "And you? What's your favorite color?", "А вам? Какой цвет вам нравится?"),
        E("……寝不足の色。", "...The color of not sleeping.", "...Цвет недосыпа.", "think"),
      ],
      [
        O("夜は長いですね。でも、明日が来ると思うと、ちっとも苦じゃないの。",
          "The nights are long. But when I think of tomorrow coming, it's no trouble at all.",
          "Ночи длинные. Но когда думаю, что настанет завтра, совсем не тяжело."),
        E("……そうですか。", "...Is that so.", "...Вот как."),
      ],
      [
        O("先生、ちゃんと食べてらっしゃる？", "Doctor, are you eating properly?", "Доктор, вы хорошо питаетесь?"),
        E("……四分の一のメロンパンを。", "...A quarter of a melon bread.", "...Четверть булочки."),
        O("まあ。それはお食事とは言いませんよ。", "Oh my. That doesn't count as a meal.", "Ох. Это не еда."),
      ],
    ],
    2: [
      [
        O("先生、さっきはありがとうございました。……私、どこへ行こうとしていたのかしら。",
          "Doctor, thank you for earlier. ...I wonder where I was trying to go.",
          "Доктор, спасибо вам за то. ...Куда же это я собиралась?"),
        E("……まだ、行かなくていいところです。", "...Somewhere you don't need to go yet.", "...Туда, куда пока не нужно.", "ponder"),
      ],
      [
        O("先生のお母様は、どんな方？", "What is your mother like, Doctor?", "Доктор, а какая у вас мама?"),
        E("……電話をすると、「寝てる？」しか聞かない人。", "...Someone who only ever asks 'Are you sleeping?' when I call.", "...Когда звоню, спрашивает только «Ты спишь?»"),
        O("ふふ。いいお母様ね。最後に電話なさったのは？", "Hehe. A good mother. When did you last call her?", "Хи-хи. Хорошая мама. Когда вы звонили ей в последний раз?"),
        E("……", "......", "......", "think"),
      ],
    ],
    3: [
      [
        O("ハルキはね、小さいころ、夜が怖くて泣いてたの。今は平気かしら。",
          "When Haruki was little, he used to cry because he was scared of the night. I wonder if he's okay now.",
          "Харуки в детстве боялся темноты и плакал. Интересно, сейчас не боится?"),
        E("……大人になれば、平気です。たぶん。", "...Adults get used to it. Probably.", "...Взрослые привыкают. Наверное."),
      ],
      [
        O("先生、面会簿、見ました？ ハルキ、昨日来たでしょう？", "Doctor, did you see the guestbook? Haruki came yesterday, didn't he?", "Доктор, вы видели журнал? Харуки ведь вчера приходил?"),
        E("……", "......", "......", "ponder"),
        E("……忙しかったんだと思います。", "...I think he was busy.", "...Думаю, он был занят."),
        O("そうね。あの子、忙しい子だから。", "Yes. He's always been a busy boy.", "Да. Он у меня всегда занятой."),
      ],
    ],
    4: [
      [
        O("先生。もうすぐ、編み上がるの。", "Doctor. It's almost finished.", "Доктор. Скоро довяжу."),
        E("……よかった。", "...Good.", "...Хорошо."),
        O("編み上がったら、どうしましょうね。ずっと編んでいたかった気もするの。",
          "What shall I do when it's done? Part of me wanted to keep knitting forever.",
          "А что я буду делать, когда закончу? Мне хотелось бы вязать вечно."),
      ],
      [
        O("先生、少し眠ってくださいな。私が見ていてあげますから。",
          "Doctor, please get a little sleep. I'll watch over you.",
          "Доктор, поспите немного. Я за вами пригляжу."),
        E("……患者に見守られる医者は、いません。", "...Doctors don't get watched over by their patients.", "...Пациенты не присматривают за врачами."),
        O("あら、いてもいいじゃありませんか。", "Oh, why not? There could be one.", "Ну а почему бы и нет?"),
      ],
    ],
  },

  kai: {
    1: [
      [
        K("先生、なんでいつも眠そうなの？", "Doctor, why do you always look sleepy?", "Доктор, почему вы всегда сонный?"),
        E("眠いから。", "Because I'm sleepy.", "Потому что хочу спать."),
        K("じゃあ寝ればいいじゃん！", "Then just sleep!", "Ну так поспите!"),
        E("……正論だな。", "...Fair point.", "...Справедливо.", "think"),
      ],
      [
        K("ぼくね、恐竜の絵がいちばん得意なの！", "I'm best at drawing dinosaurs!", "Лучше всего я рисую динозавров!"),
        E("……俺の絵は、何番目だ。", "...Where do I rank?", "...А я на каком месте?"),
        K("二番目！ 恐竜っぽいから！", "Second! 'Cause you're kinda like a dinosaur!", "На втором! Вы похожи на динозавра!"),
        E("……光栄だ。", "...I'm honored.", "...Польщён.", "crossed"),
      ],
    ],
    2: [
      [
        K("先生、ほんとにオバケじゃない？", "Doctor, are you REALLY not a ghost?", "Доктор, вы ТОЧНО не привидение?"),
        E("オバケは夜勤しない。", "Ghosts don't work night shifts.", "Привидения не работают в ночную смену."),
        K("夜しか出てこないじゃん、オバケって！", "But ghosts only come out at night!", "Привидения как раз только ночью и выходят!"),
        E("……", "......", "......", "annoyed"),
      ],
      [
        K("ツブ、かわいいよね！ ぼくもほしい！", "Tsubu's so cute! I want one too!", "Цубу такой милый! Я тоже хочу!"),
        E("一匹で十分だ。うるさいから。", "One's enough. It's loud.", "Одного хватит. Он громкий."),
        K("ツブ、さっき「カイはひかってる」って言ってたよ。どういう意味？",
          "Tsubu said 'Kai is shining' earlier. What does that mean?",
          "Цубу сказал: «Кай светится». Что это значит?"),
        E("……さあ。", "...No idea.", "...Не знаю.", "wary"),
      ],
    ],
    3: [
      [
        K("先生、朝ってどんな色？", "Doctor, what color is morning?", "Доктор, а утро какого цвета?"),
        E("……白くて、少し黄色い。", "...White. A little yellow.", "...Белое. Чуть жёлтое.", "ponder"),
        K("プリンみたい！", "Like pudding!", "Как пудинг!"),
        E("……そうだな。プリンみたいだ。", "...Yeah. Like pudding.", "...Да. Как пудинг."),
      ],
      [
        K("ぼく、お母さんに会いたいな。", "I miss my mom.", "Я скучаю по маме."),
        E("……", "......", "......", "ponder"),
        K("でも、先生がいるからいいや！", "But it's okay, 'cause you're here!", "Но ничего, тут же вы!"),
        E("……ああ。いる。", "...Yeah. I'm here.", "...Да. Я здесь."),
      ],
    ],
    4: [
      [
        K("小田のおばあちゃん、どこ行ったの？", "Where did Grandma Oda go?", "А куда ушла бабушка Ода?"),
        E("……退院した。", "...She was discharged.", "...Её выписали."),
        K("いいなあ。ぼくも早く退院したい。……でも、ちょっとこわい。",
          "Lucky. I want to be discharged too. ...But it's kinda scary.",
          "Везёт. Я тоже хочу выписаться. ...Но немного страшно."),
        E("……こわくない。たぶん。", "...It's not scary. Probably.", "...Не страшно. Наверное."),
      ],
      [
        K("佐藤のおじさん、最後に時計の音聞かせてくれたよ。チクタクって。", "Mr. Sato let me hear his watch before he left. Tick-tock.", "Дядя Сато дал мне послушать свои часы перед уходом. Тик-так."),
        E("……よかったな。", "...That's nice.", "...Здорово."),
      ],
    ],
    5: [
      [
        K("先生、ぼくの絵、全部とっておいてね。", "Doctor, keep all my drawings, okay?", "Доктор, сохраните все мои рисунки, ладно?"),
        E("……全部、とってある。", "...I've kept them all.", "...Все сохранил."),
        K("ほんと？ 先生の机の引き出し、いっぱい？", "Really? Is your desk drawer full?", "Правда? Ящик стола уже полный?"),
        E("……いっぱいだ。", "...Full.", "...Полный."),
      ],
      [
        K("先生、四番の人、起きないね。", "Doctor, the person in Bed 4 won't wake up.", "Доктор, человек на четвёртой не просыпается."),
        E("……疲れてるんだ。", "...They're tired.", "...Устал.", "ponder"),
        K("先生と一緒だね。", "Just like you.", "Как вы."),
      ],
    ],
  },

  sato: {
    1: [
      [
        S("先生、今は何時だ。", "Doctor, what time is it?", "Доктор, который час?"),
        E("三時三十三分です。", "3:33.", "3:33."),
        S("さっきもそう言ったな。", "You said that earlier.", "Вы это уже говорили."),
        E("……さっきも、そうだったので。", "...It was 3:33 earlier too.", "...Тогда тоже было 3:33.", "think"),
      ],
      [
        S("この病院は名刺を受け取らんのか。受付の娘に断られた。", "Doesn't this hospital accept business cards? The girl at reception refused mine.", "Эта больница визитки не принимает? Девушка в регистратуре отказалась."),
        E("……ここでは、肩書きはいらないので。", "...Titles aren't needed here.", "...Здесь должности ни к чему."),
      ],
    ],
    2: [
      [
        S("先生、君は時計を持たないのか。", "Doctor, don't you carry a watch?", "Доктор, вы не носите часов?"),
        E("……見ても、変わらないので。", "...Looking doesn't change anything.", "...Смотри не смотри — ничего не меняется."),
        S("……一理ある。", "...You have a point.", "...Резонно."),
      ],
      [
        S("お茶がぬるい。", "The tea is lukewarm.", "Чай остыл."),
        E("……リンに言ってください。", "...Tell Rin.", "...Скажите Рин."),
        S("言った。「ぬるいのが流行りです」と言われた。", "I did. She said, 'Lukewarm is in right now.'", "Сказал. Она ответила: «Сейчас модно тёпленькое»."),
        E("……すみません。", "...My apologies.", "...Простите.", "crossed"),
      ],
    ],
    3: [
      [
        S("先生、娘がいるんだ。ピアノが上手でね。", "Doctor, I have a daughter. She's very good at piano.", "Доктор, у меня есть дочь. Прекрасно играет на пианино."),
        E("……聴きに行けますね。退院したら。", "...You can go hear her play. After discharge.", "...Сходите послушать. После выписки."),
        S("ああ。……いつも、行こうとはしていたんだ。", "Yes. ...I always meant to go.", "Да. ...Я всегда собирался."),
      ],
      [
        S("先生、この時計はね、娘にもらったんだ。", "Doctor, this watch was a gift from my daughter.", "Доктор, эти часы подарила мне дочь."),
        E("……大事にしてますね。", "...You take good care of it.", "...Вы их бережёте."),
        S("止まってからのほうが、よく見るようになった。皮肉なもんだ。",
          "I've looked at it more since it stopped. Ironic.",
          "С тех пор как они встали, смотрю на них чаще. Ирония."),
      ],
    ],
    4: [
      [
        S("先生。聞こえるか、この音。", "Doctor. Can you hear that?", "Доктор. Слышите этот звук?"),
        N("チク、タク。", "Tick, tock.", "Тик-так."),
        E("……聞こえます。", "...I hear it.", "...Слышу."),
        S("……いい音だな。", "...Good sound.", "...Хороший звук."),
      ],
      [
        S("先生、君は退院しないのか。", "Doctor, won't you be discharged?", "Доктор, а вас не выпишут?"),
        E("……医者なので。", "...I'm the doctor.", "...Я же врач."),
        S("医者だって、帰る家はあるだろう。", "Even doctors have homes to go back to.", "Даже у врачей есть дом."),
        E("……", "......", "......", "ponder"),
      ],
    ],
  },
};

// ───────────────────────── EXAMINE ─────────────────────────
const EXAMINE = {
  // reception
  clock: {
    def: [
      E("……三時三十三分。", "...3:33.", "...3:33."),
      E("電池が古いのかもしれない。……叩けば動きそうな顔をしてる。何度か、素早く。", "Maybe the battery's old. ...It looks like the kind of clock that starts if you tap it. A few times, quickly.", "Может, батарейка села. ...У них такой вид, будто пойдут, если постучать. Несколько раз, быстро.", "think"),
      E("……医者の発想じゃないな。", "...Not a very medical idea.", "...Не очень-то врачебная мысль."),
    ],
    n: {
      3: [
        E("……さっき、針が一瞬だけ戻った気がした。", "...For a second, I thought the hands went backward.", "...Мне показалось, стрелки на миг пошли назад.", "wary"),
        E("三回叩いたら、返事をしそうだ。……気のせいだ。", "Tap it three times and it might answer. ...I'm imagining things.", "Постучишь три раза — и они ответят. ...Мерещится."),
      ],
      5: [
        E("三時三十三分。……知ってる。", "3:33. ...I know.", "3:33. ...Знаю.", "ponder"),
        E("この時計だけは、俺より先に起きてる。", "This clock is the one thing that wakes up before I do.", "Только эти часы просыпаются раньше меня."),
      ],
    },
  },
  bell: {
    def: [
      E("呼び出しベル。リンはこれを一晩に四十回鳴らす。", "The service bell. Rin rings it forty times a night.", "Звонок вызова. Рин звонит в него раз сорок за ночь."),
      E("……用事は二回くらいだ。", "...About two of those are for something.", "...По делу — раза два."),
    ],
    n: {
      4: [
        E("誰もいないのに、さっき鳴った。", "It rang a moment ago. Nobody was here.", "Только что зазвенел. Никого не было.", "wary"),
        E("……退院の合図、なのかもしれない。", "...Maybe it's a discharge signal.", "...Может, это сигнал выписки.", "ponder"),
      ],
    },
  },
  guestbook: {
    def: [
      E("面会簿。きれいな字で日付だけ並んでる。", "The guestbook. Neat rows of dates, nothing else.", "Журнал посещений. Аккуратные даты — и больше ничего."),
      E("……日付が、全部同じだ。", "...All the dates are the same.", "...Все даты одинаковые.", "think"),
    ],
    n: {
      3: [
        E("小田さんの欄。面会者、なし。……毎日、なし。", "Mrs. Oda's row. Visitors: none. ...Every day, none.", "Строка госпожи Оды. Посетители: нет. ...Каждый день — нет.", "ponder"),
        E("最後のページだけ、インクが乾いてない。", "Only the last page is still wet.", "Только на последней странице чернила не высохли."),
      ],
      5: [
        E("……一番下に、俺の名前がある。面会者の欄に。", "...My name is at the very bottom. In the visitor column.", "...В самом низу — моё имя. В графе посетителей.", "wary"),
        E("書いた覚えは、ない。", "I don't remember writing it.", "Не помню, чтобы писал."),
      ],
    },
  },
  plant: {
    def: [
      E("観葉植物。水をやった記憶はないが、元気だ。", "A potted plant. I don't remember watering it, but it's thriving.", "Комнатное растение. Не помню, чтобы поливал, но оно цветёт."),
      E("……俺よりは健康そうだ。", "...Healthier than me, anyway.", "...Здоровее меня, во всяком случае."),
    ],
    n: {
      4: [E("葉っぱが、窓と反対側を向いてる。光のない方へ。", "The leaves face away from the window. Toward where there's no light.", "Листья повёрнуты от окна. Туда, где нет света.", "think")],
    },
  },
  poster: {
    def: [
      E("「手洗い・うがい・夜ふかし禁止」。", "'Wash your hands. Gargle. No staying up late.'", "«Мойте руки. Полощите горло. Не засиживайтесь допоздна»."),
      E("……三つ目は、無理だな。", "...Can't help with the third one.", "...Третье — невыполнимо.", "crossed"),
    ],
    n: {
      5: [E("「夜ふかし」のところだけ、誰かが線で消してある。", "Someone crossed out 'staying up late.'", "Кто-то зачеркнул «не засиживайтесь».", "ponder")],
    },
  },
  window_rec: {
    def: [
      E("外は暗い。街灯も見えない。", "It's dark outside. Not even a streetlight.", "Снаружи темно. Даже фонарей не видно."),
      E("……ここ、何階だったか。", "...What floor are we on, again?", "...На каком мы этаже?", "think"),
    ],
    n: {
      4: [E("少しだけ、白い。……すぐ、戻った。", "A little pale. ...Then it went back.", "Чуть посветлело. ...И снова потемнело.", "ponder")],
    },
  },

  // corridor
  poster_cor: {
    def: [
      E("「廊下は走らない」。カイ用だ。", "'No running in the halls.' That one's for Kai.", "«По коридору не бегать». Это для Кая."),
      K("ぼく、飛んでるからセーフ！", "I'm flying, so it doesn't count!", "Я летаю, так что не считается!"),
    ],
    n: {
      3: [
        E("下に小さく書き足してある。「廊下は帰らない」。", "Someone added small print underneath: 'No leaving through the halls.'", "Внизу кто-то мелко дописал: «По коридору не уходить».", "wary"),
      ],
      6: [E("「廊下は走らない」。……もう、走る子はいない。", "'No running in the halls.' ...No one left to run.", "«По коридору не бегать». ...Бегать больше некому.", "ponder")],
    },
  },
  water: {
    def: [
      E("ウォーターサーバー。水はいつも冷たい。", "A water cooler. The water's always cold.", "Кулер с водой. Вода всегда холодная."),
      E("……補充されてるところを、見たことがない。", "...I've never seen anyone refill it.", "...Ни разу не видел, чтобы его доливали.", "think"),
    ],
  },
  wheelchair: {
    def: [
      E("車椅子。カイがレースカーにしてる。", "A wheelchair. Kai uses it as a race car.", "Инвалидное кресло. Кай гоняет на нём, как на машине."),
      E("ブレーキは壊れてる。……カイには黙っておく。", "The brake's broken. ...Not telling Kai.", "Тормоз сломан. ...Каю не скажу.", "crossed"),
    ],
    n: {
      5: [E("……誰も乗せる相手がいない。", "...No one left to push.", "...Некого больше катать.", "ponder")],
    },
  },
  black_door: {
    def: [
      E("……壁だ。", "...That's a wall.", "...Это стена."),
      E("……ドア、か？", "...A door?", "...Дверь?", "wary"),
      E("いや。壁だ。壁のはずだ。", "No. It's a wall. I'm sure it's a wall.", "Нет. Стена. Точно стена.", "think"),
    ],
  },
  black_door_locked: {
    def: [
      E("黒いドア。取っ手はない。鍵穴だけがある。", "A black door. No handle. Just a keyhole.", "Чёрная дверь. Без ручки. Только замочная скважина.", "wary"),
      E("……古い鍵だ。手もとには、ない。", "...An old-fashioned lock. I don't have the key.", "...Старый замок. Ключа у меня нет."),
      E("鍵穴の向こうから、かすかに音がする。……ノックみたいな。", "There's a faint sound from the other side of the keyhole. ...Like knocking.", "Из-за скважины доносится тихий звук. ...Будто стук.", "ponder"),
    ],
    n: {
      5: [
        E("鍵穴から、風が吹いてくる。朝の匂いがする。", "A breeze comes through the keyhole. It smells like morning.", "Из скважины тянет ветерком. Пахнет утром.", "ponder"),
      ],
    },
  },

  // office
  pc: {
    def: [
      E("カルテのシステム。起動に四分かかる。", "The records system. Takes four minutes to boot.", "Система медкарт. Загружается четыре минуты."),
      E("……四分あれば、少し眠れる。眠らないけど。", "...Four minutes is enough for a nap. Not that I take one.", "...За четыре минуты можно вздремнуть. Но я не стану."),
    ],
    n: {
      3: [E("ログイン履歴、全部同じ時刻だ。03:33。", "Every login in the history has the same timestamp. 03:33.", "Все входы в системе в одно и то же время. 03:33.", "think")],
      5: [E("ユーザー名の欄に「E. Hale」と出ている。……ログアウトされてない。何年も。", "The user field says 'E. Hale.' ...Never logged out. For years.", "В поле пользователя — «E. Hale». ...Не выходил из системы. Годами.", "wary")],
    },
  },
  mug: {
    def: [
      E("マグカップ。コーヒーが入ってる。", "A mug. There's coffee in it.", "Кружка. В ней кофе."),
      E("……冷めてる。いつ淹れたか、覚えてない。", "...It's cold. Don't remember when I made it.", "...Остыл. Не помню, когда наливал.", "think"),
    ],
    n: {
      4: [E("ずっと冷めてる。でも、減らない。", "Still cold. But it never goes down.", "Всё такой же холодный. И не убывает.", "ponder")],
    },
  },
  diploma: {
    def: [
      E("医師免許。……俺の名前だ。", "Medical license. ...My name.", "Врачебная лицензия. ...Моё имя."),
      E("写真の俺は、まだ眠そうじゃない。", "The me in the photo doesn't look sleepy yet.", "На фото я ещё не выгляжу сонным."),
    ],
  },
  window_off: {
    def: [
      E("診察室の窓。ガラスに自分が映る。", "The office window. My reflection shows in the glass.", "Окно кабинета. В стекле — моё отражение."),
      E("……ひどい顔だ。リンの言う通り。", "...Terrible face. Rin's right.", "...Ужасное лицо. Рин права.", "crossed"),
    ],
    n: {
      5: [E("……映ってない。", "...No reflection.", "...Отражения нет.", "wary")],
    },
  },
  bookshelf: {
    def: [
      E("医学書。半分は俺のじゃない。", "Medical books. Half of them aren't mine.", "Медицинские книги. Половина — не мои."),
      E("『睡眠障害の手引き』。しおりが一ページ目に挟まってる。", "'A Guide to Sleep Disorders.' Bookmark on page one.", "«Руководство по расстройствам сна». Закладка на первой странице.", "think"),
    ],
  },
  photo: {
    def: [
      E("診療所のスタッフ写真。リンと、俺と……", "The clinic staff photo. Rin, me, and...", "Фото персонала клиники. Рин, я и..."),
      E("……誰だったか。", "...Who was that, again?", "...Кто же это был?", "think"),
    ],
    n: {
      3: [E("端の一人の顔が、引っかき傷で消えてる。……白衣を着てる。", "One face at the edge has been scratched out. ...They're wearing a white coat.", "Одно лицо с краю процарапано. ...На человеке белый халат.", "wary")],
      5: [E("引っかかれた顔の下に、名札だけ見える。「E. H」。", "Under the scratched face, only the nametag is visible. 'E. H.'", "Под процарапанным лицом виден лишь бейдж. «E. H».", "ponder")],
    },
  },

  // ward
  drawing: {
    def: [
      E("カイの絵。恐竜と、俺と、ツブ。", "Kai's drawing. A dinosaur, me, and Tsubu.", "Рисунок Кая. Динозавр, я и Цубу."),
      E("俺のほうが、恐竜より目つきが悪い。", "I look meaner than the dinosaur.", "У меня взгляд злее, чем у динозавра.", "crossed"),
    ],
    n: {
      2: [E("……俺の足もとにだけ、影がない。", "...Only I don't have a shadow.", "...Только у меня нет тени.", "wary")],
      5: [E("絵の端に、四番ベッドが描いてある。誰かが寝てる。白衣で。", "Bed 4 is drawn in the corner. Someone's lying in it. In a white coat.", "В углу нарисована четвёртая койка. На ней кто-то лежит. В халате.", "ponder")],
    },
  },
  tv_ward: {
    def: [
      E("病棟のテレビ。深夜の通販番組しか映らない。", "The ward TV. Nothing but late-night infomercials.", "Телевизор в палате. Только ночные телемагазины."),
      E("「今なら三時三十三分まで、送料無料」。", "'Free shipping until 3:33 only!'", "«Бесплатная доставка — только до 3:33!»", "think"),
    ],
    n: {
      4: [E("番組が、ずっと同じ商品を売ってる。目覚まし時計。", "The show keeps selling the same item. An alarm clock.", "В передаче всё время продают одно и то же. Будильник.", "ponder")],
    },
  },
  curtain4: {
    def: [
      E("四番ベッドのカーテン。閉まってる。", "Bed 4's curtain. Closed.", "Занавеска у четвёртой койки. Задёрнута."),
      E("……開けようとすると、手が止まる。", "...When I try to open it, my hand stops.", "...Пытаюсь отдёрнуть — рука останавливается.", "wary"),
    ],
    n: {
      3: [E("向こうから、規則正しい寝息……いや。何も聞こえない。", "From the other side, steady breathing... no. Nothing.", "С той стороны — ровное дыхание... нет. Ничего.", "wary")],
      5: [E("……知ってる。誰がいるか。", "...I know. Who's in there.", "...Я знаю. Кто там.", "ponder")],
    },
  },
  nametag4: {
    def: [
      E("ベッド四の名札。文字がかすれてる。", "Bed 4's nametag. The letters are faded.", "Табличка четвёртой койки. Буквы выцвели."),
      E("「E. H……le」。", "'E. H...le.'", "«E. H...le».", "think"),
      E("……ヘイル、か。よくある名前だ。", "...Hale, maybe. Common name.", "...Хейл, наверное. Распространённая фамилия.", "ponder"),
    ],
    n: {
      5: [
        E("「E. Hale」。はっきり読める。", "'E. Hale.' Perfectly legible.", "«E. Hale». Читается отчётливо.", "ponder"),
        E("……よくある名前だ。", "...Common name.", "...Распространённая фамилия."),
      ],
    },
  },

  // pharmacy
  shelves: {
    def: [
      E("薬棚。リンのくしゃみに三回耐えた歴戦の棚だ。", "The medicine shelves. Veterans of three of Rin's sneezes.", "Аптечные полки. Пережили три чиха Рин."),
      E("一番上の段に、空の瓶がひとつ。ラベルは「ツブ（予備）」。", "On the top shelf, an empty bottle. Label: 'Tsubu (spare).'", "На верхней полке пустая банка. Этикетка: «Цубу (запасной)».", "crossed"),
    ],
  },
  note_pharm: {
    def: [
      E("棚に貼られたメモ。俺の字に似てる。", "A note stuck to the shelf. It looks like my handwriting.", "Записка на полке. Похоже на мой почерк.", "think"),
      N("「うるさすぎると、ドアの音が聞こえない」", "'If it's too loud, you can't hear the door.'", "«Если слишком шумно, не услышишь дверь»."),
      E("……書いた覚えはない。", "...I don't remember writing it.", "...Не помню, чтобы писал.", "ponder"),
    ],
  },
  fridge: {
    def: [
      E("薬用冷蔵庫。ワクチンと、なぜかプリン。", "The medicine fridge. Vaccines and, for some reason, pudding.", "Медицинский холодильник. Вакцины и почему-то пудинг."),
      E("……ツブの分だ。触らない。", "...That's Tsubu's. Hands off.", "...Это для Цубу. Не трогаю."),
    ],
    n: {
      3: [E("扉の内側の金属に、俺が映ってない。……光の加減だ。", "My reflection isn't in the metal inside the door. ...Just the lighting.", "В металле дверцы меня не видно. ...Освещение такое.", "wary")],
    },
  },
  scale: {
    def: [
      E("体重計。乗ってみる。", "A scale. I step on.", "Весы. Встаю."),
      E("……0.0kg。壊れてる。", "...0.0 kg. Broken.", "...0,0 кг. Сломаны.", "think"),
    ],
    n: {
      4: [E("ツブを乗せたら、ちゃんと測れた。……俺のときだけ壊れる。", "It weighed Tsubu just fine. ...It's only broken for me.", "Цубу взвесили нормально. ...Ломаются только на мне.", "ponder")],
    },
  },

  // lounge
  couch: {
    def: [
      E("休憩室のソファ。座ると、二度と立てなくなる。", "The break room couch. Sit down and you'll never get back up.", "Диван в комнате отдыха. Сядешь — больше не встанешь."),
      E("……比喩だ。たぶん。", "...Figuratively. Probably.", "...В переносном смысле. Наверное."),
    ],
  },
  vending: {
    def: [
      E("自販機。おしるこ、コーンスープ、プリン味の水。", "Vending machine. Red bean soup, corn soup, pudding-flavored water.", "Торговый автомат. Суп из фасоли, кукурузный суп, вода со вкусом пудинга."),
      E("……最後のは誰が買うんだ。", "...Who buys that last one?", "...Кто покупает последнее?", "crossed"),
    ],
    n: {
      3: [
        E("小銭を入れて、ボタンを押した。", "I put in a coin and pressed a button.", "Бросил монетку, нажал кнопку."),
        E("……何も出てこない。小銭も、戻ってこない。", "...Nothing came out. The coin didn't come back either.", "...Ничего не выпало. И монетка не вернулась.", "wary"),
      ],
    },
  },
  arcade: {
    def: [
      E("古いアーケード筐体。「ナイトシフト・ドクター」。", "An old arcade cabinet. 'Night Shift Doctor.'", "Старый игровой автомат. «Доктор ночной смены»."),
      E("ハイスコアは全部「EMR」。……覚えてない。", "Every high score is 'EMR.' ...Don't remember any of them.", "Все рекорды — «EMR». ...Не помню ни одного.", "think"),
    ],
    n: {
      5: [E("画面に「CONTINUE?」。カウントダウンが、3で止まってる。", "The screen says 'CONTINUE?' The countdown is stuck at 3.", "На экране «CONTINUE?». Отсчёт застыл на 3.", "ponder")],
    },
  },
  tv_static: {
    def: [
      E("砂嵐。音は消してある。", "Static. Sound's off.", "Помехи. Звук выключен."),
      E("……音を消すと、かえって何か聞こえる気がする。", "...With the sound off, it feels like I can hear something else.", "...Без звука будто слышно что-то другое.", "ponder"),
    ],
  },
  calendar: {
    def: [
      E("カレンダー。今日に丸がついてる。", "A calendar. Today's circled.", "Календарь. Сегодня обведено."),
      E("……昨日も、この日に丸がついてた。", "...This same date was circled yesterday.", "...Вчера обведено было это же число.", "think"),
    ],
    n: {
      3: [E("めくっても、めくっても、同じ月だ。", "I keep flipping and it's the same month.", "Листаю, листаю — всё тот же месяц.", "wary")],
    },
  },

  // storage
  boxes: {
    def: [
      E("段ボール。「備品」「備品」「プリン」「備品」。", "Cardboard boxes. 'Supplies,' 'Supplies,' 'Pudding,' 'Supplies.'", "Коробки. «Инвентарь», «Инвентарь», «Пудинг», «Инвентарь»."),
      E("……誰の発注だ。", "...Who ordered that?", "...Кто это заказал?", "crossed"),
    ],
  },
  mop: {
    def: [
      E("モップ。リンが「モップ先輩」と呼んでる。", "A mop. Rin calls it 'Senior Mop.'", "Швабра. Рин зовёт её «старшая коллега Швабра»."),
      E("……俺より勤続年数が長いらしい。", "...Apparently it's been here longer than me.", "...Говорят, у неё стаж больше моего."),
    ],
  },
  lost_found: {
    def: [
      E("落とし物箱。片方の手袋、名前のないお守り、止まった懐中時計。", "The lost and found box. A single glove, an unnamed charm, a stopped pocket watch.", "Ящик находок. Одна перчатка, безымянный оберег, остановившиеся карманные часы."),
      N("底に、メモが貼ってある。「なくしたものは、待っていれば見つかります」", "A note is stuck to the bottom: 'Things you lose are found if you wait long enough.'", "На дне записка: «Потерянное находится, если подождать подольше»."),
      E("……待つのは、得意だ。", "...Waiting, I can do.", "...Ждать я умею.", "ponder"),
    ],
  },
  stairs_down: {
    def: [
      E("地下への階段。電気がつかない。", "Stairs going down to the basement. The light won't come on.", "Лестница в подвал. Свет не включается."),
      E("……地下、あったか？ この建物。", "...Does this building even have a basement?", "...А в этом здании вообще есть подвал?", "wary"),
    ],
  },
  ladder: {
    def: [
      E("はしご。屋上に続いてる。", "A ladder. It goes up to the roof.", "Лестница. Ведёт на крышу."),
      E("……夜風に当たるのも、たまにはいい。", "...A little night air wouldn't hurt.", "...Иногда полезно подышать ночным воздухом."),
    ],
  },

  // records
  files: {
    def: [
      E("カルテの束。全員、受診日が同じだ。", "A stack of charts. Every patient has the same visit date.", "Стопка карт. У всех пациентов одна и та же дата приёма.", "think"),
      E("……入力ミスだ。きっと。", "...A typo. Surely.", "...Опечатка. Наверняка."),
    ],
    n: {
      4: [E("小田さんと佐藤さんのカルテに、「退院」の判子。……日付は、明け方。", "Mrs. Oda's and Mr. Sato's charts have a 'Discharged' stamp. ...The date is dawn.", "На картах госпожи Оды и господина Сато — штамп «Выписан». ...Время — рассвет.", "ponder")],
    },
  },
  cabinet: {
    def: [
      E("鍵のかかったキャビネット。「H」の引き出しだけ、少し開いてる。", "A locked filing cabinet. Only the 'H' drawer is slightly open.", "Запертый шкаф. Приоткрыт только ящик «H».", "wary"),
      E("……閉めておく。", "...I'll close it.", "...Закрою."),
    ],
    n: {
      5: [
        E("「H」の引き出し。カルテが一枚。「夜勤中に倒れ——」", "The 'H' drawer. A single chart. 'Collapsed during night sh—'", "Ящик «H». Одна карта. «Упал во время ночной сме—»", "wary"),
        E("……続きは、読まない。シフト中だ。", "...I won't read the rest. I'm on shift.", "...Дальше читать не буду. Я на смене.", "ponder"),
      ],
    },
  },
  lamp: {
    def: [
      E("デスクランプ。ここだけ、明かりがあたたかい。", "A desk lamp. The light is warmer here than anywhere else.", "Настольная лампа. Только здесь свет тёплый."),
      E("……ここで書類を書いて、そのまま寝た誰かがいた気がする。", "...I feel like someone once did paperwork here and fell asleep.", "...Кажется, кто-то когда-то писал здесь бумаги и уснул прямо за столом.", "ponder"),
    ],
  },

  // rooftop
  railing: {
    def: [
      E("手すり。冷たい。", "The railing. Cold.", "Перила. Холодные."),
      E("……下は、霧で見えない。", "...Can't see the ground through the fog.", "...Внизу ничего не видно из-за тумана.", "wary"),
    ],
  },
  sky: {
    def: [
      E("星が多い。街の明かりがないからだ。", "Lots of stars. No city lights, that's why.", "Много звёзд. Потому что нет городских огней."),
      E("……東は、どっちだったか。", "...Which way was east?", "...Где здесь восток?", "think"),
    ],
    n: {
      4: [E("東の端が、少しだけ白い。……二人分だけ。", "The eastern edge is just slightly pale. ...Just enough for two.", "Край на востоке чуть побелел. ...Ровно на двоих.", "ponder")],
      5: [E("……また暗くなった。夜明けは、俺の番じゃないらしい。", "...Dark again. Seems dawn isn't my turn.", "...Опять темно. Видимо, рассвет — не моя очередь.", "ponder")],
    },
  },
  bench: {
    def: [
      E("ベンチ。誰かの毛糸が一本、引っかかってる。赤い。", "A bench. A single strand of someone's yarn is caught on it. Red.", "Скамейка. На ней зацепилась чья-то нитка. Красная."),
      E("……少し、座る。少しだけ。", "...I'll sit. Just for a bit.", "...Присяду. Ненадолго."),
    ],
  },
};

// ───────────────────────── ANOMALIES ─────────────────────────
const ANOMALIES = {
  clock_back: {
    title: t("戻る時計", "The Clock That Goes Back", "Часы, идущие назад"),
    desc: t("受付の時計の針が、ほんの一瞬だけ逆に動いた。三時三十三分に戻るために。",
      "For an instant, the reception clock's hands moved backward. As if to return to 3:33.",
      "На мгновение стрелки часов в приёмной пошли назад. Словно чтобы вернуться к 3:33."),
  },
  calendar_same: {
    title: t("めくれないカレンダー", "The Calendar That Won't Turn", "Календарь, который не листается"),
    desc: t("毎晩、同じ日に丸がついている。めくっても、同じ月が出てくる。",
      "The same day is circled every night. Flip the page and the same month appears.",
      "Каждую ночь обведён один и тот же день. Перелистнёшь — тот же месяц."),
  },
  kai_shadow: {
    title: t("影のない先生", "A Doctor With No Shadow", "Доктор без тени"),
    desc: t("カイの絵の中で、先生にだけ影がない。カイは「ちゃんと見て描いた」と言う。",
      "In Kai's drawing, only the doctor has no shadow. Kai says he drew exactly what he saw.",
      "На рисунке Кая только у доктора нет тени. Кай говорит, что рисовал, как видел."),
  },
  guestbook_empty: {
    title: t("空白の面会簿", "The Blank Guestbook", "Пустой журнал посещений"),
    desc: t("小田さんの息子は「明日来る」。面会簿には、一度も名前がない。",
      "Mrs. Oda's son is 'coming tomorrow.' His name has never once appeared in the guestbook.",
      "Сын госпожи Оды «приедет завтра». В журнале его имени нет ни разу."),
  },
  photo_scratched: {
    title: t("消された顔", "The Scratched-Out Face", "Процарапанное лицо"),
    desc: t("スタッフ写真の端で、白衣の誰かの顔が引っかかれて消えている。",
      "At the edge of the staff photo, someone in a white coat has had their face scratched away.",
      "На краю фото персонала у человека в белом халате процарапано лицо."),
  },
  sato_watch: {
    title: t("動き出した腕時計", "The Watch That Started", "Часы, которые пошли"),
    desc: t("三時三十三分で止まっていた佐藤さんの腕時計が、退院の夜に動き出した。",
      "Mr. Sato's watch, stopped at 3:33, began ticking on the night of his discharge.",
      "Часы господина Сато, стоявшие на 3:33, пошли в ночь его выписки."),
  },
  room4_tag: {
    title: t("四番ベッドの名札", "Bed 4's Nametag", "Табличка четвёртой койки"),
    desc: t("かすれた名札。「E. Hale」。よくある名前、だと思う。",
      "A faded nametag. 'E. Hale.' A common name, probably.",
      "Выцветшая табличка. «E. Hale». Распространённая фамилия, наверное."),
  },
  rin_dayshift: {
    title: t("昼のシフト", "The Day Shift", "Дневная смена"),
    desc: t("リンは昼のシフトの同僚を思い出せない。自分の家のドアの色も。",
      "Rin can't remember her day shift coworker. Or the color of her own front door.",
      "Рин не может вспомнить коллегу из дневной смены. И цвет своей входной двери."),
  },
  fridge_reflect: {
    title: t("映らない冷蔵庫", "The Fridge With No Reflection", "Холодильник без отражения"),
    desc: t("冷蔵庫の扉の金属に、プリンは映る。先生は映らない。",
      "The pudding shows up in the fridge door's metal. The doctor doesn't.",
      "В металле дверцы холодильника отражается пудинг. Доктор — нет."),
  },
  window_corridor: {
    title: t("多すぎるドア", "One Door Too Many", "Лишняя дверь"),
    desc: t("廊下の奥、倉庫の手前。壁のはずの場所に、黒いドアがある。",
      "At the end of the corridor, just before storage. Where there should be a wall, there's a black door.",
      "В конце коридора, перед кладовкой. Там, где должна быть стена, — чёрная дверь."),
  },
  vending_nothing: {
    title: t("何も出ない自販機", "The Machine That Gives Nothing", "Автомат, который ничего не даёт"),
    desc: t("小銭を入れても、何も出てこない。小銭も戻らない。どこへ行ったのだろう。",
      "Put in a coin and nothing comes out. The coin doesn't come back either. Where did it go?",
      "Бросишь монетку — ничего не выпадет. И монетка не вернётся. Куда она делась?"),
  },
  records_same: {
    title: t("同じ受診日", "The Same Visit Date", "Одна и та же дата"),
    desc: t("すべてのカルテの受診日が、同じ日付になっている。先生のものも。",
      "Every chart lists the same visit date. Including the doctor's.",
      "На всех картах одна и та же дата приёма. Даже на карте доктора."),
  },
  rooftop_nodawn: {
    title: t("来ない夜明け", "The Dawn That Doesn't Come", "Рассвет, который не наступает"),
    desc: t("東の空は、誰かが退院するときだけ白くなる。そしてまた、夜に戻る。",
      "The eastern sky only turns pale when someone is discharged. Then it goes back to night.",
      "Восточное небо светлеет, только когда кого-то выписывают. А потом снова ночь."),
  },
};

// ───────────────────────── LOADING ─────────────────────────
const LOADING = [
  t("手洗いは三十秒。歌うなら、短い歌で。", "Wash your hands for thirty seconds. If you sing, pick a short song.", "Мойте руки тридцать секунд. Если поёте — выбирайте короткую песню."),
  t("面会時間：3:33〜3:33", "Visiting hours: 3:33–3:33", "Часы посещений: 3:33–3:33"),
  t("ツブにプリンをあげると、元気になります。あなたも。", "Giving Tsubu pudding cheers it up. You too.", "Пудинг поднимает Цубу настроение. И вам тоже."),
  t("夜勤のコツ：眠くなったら、眠くないふりをする。", "Night shift tip: when you get sleepy, pretend you're not.", "Совет ночной смены: хотите спать — делайте вид, что не хотите."),
  t("廊下は走らないでください。飛ぶのも禁止です。", "No running in the halls. Flying is also prohibited.", "По коридору не бегать. Летать тоже запрещено."),
  t("リンの「たぶん」は、だいたい三割当たります。", "Rin's 'probably' is right about thirty percent of the time.", "«Наверное» Рин сбывается примерно в тридцати процентах случаев."),
  t("お薬は、ラベルを二回確認しましょう。三回目は、念のため。", "Check medicine labels twice. A third time, just in case.", "Проверяйте этикетки дважды. В третий раз — на всякий случай."),
  t("退院は、明け方に行われます。", "Discharges take place at dawn.", "Выписка проводится на рассвете."),
  t("夜明けの予定：未定", "Scheduled dawn: TBD", "Рассвет: дата уточняется"),
  t("当院の夜は、少し長めです。", "Nights at our clinic run a little long.", "Ночи в нашей клинике немного длиннее обычных."),
  t("迷子になったら、受付の時計を目印に。いつも同じ時刻を指しています。", "If you get lost, use the reception clock as a landmark. It always shows the same time.", "Заблудились — ориентируйтесь на часы в приёмной. Они всегда показывают одно время."),
  t("ツブは昨日のことを覚えています。本人いわく。", "Tsubu remembers yesterday. According to Tsubu.", "Цубу помнит вчерашний день. По его словам."),
  t("落とし物は受付まで。気長にお待ちください。", "Lost items: please ask at reception. Be patient.", "Потерянные вещи — в приёмной. Наберитесь терпения."),
  t("四番ベッドは現在、ご使用中です。", "Bed 4 is currently occupied.", "Четвёртая койка в настоящее время занята."),
  t("先生への差し入れは、四分の一サイズでも喜ばれます。", "Gifts for the doctor are appreciated, even quarter-sized ones.", "Доктор рад угощениям, даже если это четвертинка."),
  t("音が多すぎると、聞こえないものもあります。", "When there's too much noise, some things can't be heard.", "Когда слишком шумно, кое-что не слышно."),
  t("深呼吸。吸って、吐いて。……吐きましたか？", "Deep breath. In, and out. ...Did you breathe out?", "Глубокий вдох. Вдох и выдох. ...Вы выдохнули?"),
  t("当院では、ほかで断られた方を歓迎します。", "We welcome those who have been turned away elsewhere.", "Мы рады тем, кому отказали в других местах."),
  t("心電図の波は、上がって下がるのが正常です。", "On an ECG, it's normal for the line to go up and down.", "На ЭКГ нормально, когда линия поднимается и опускается."),
  t("自販機のおつりは、出ません。", "The vending machine does not give change.", "Автомат сдачу не выдаёт."),
  t("夜食は二時と、三時三十三分です。", "Midnight snacks are served at 2:00 and at 3:33.", "Ночной перекус — в 2:00 и в 3:33."),
  t("屋上からは、いい星が見えます。朝は見えません。", "You can see lovely stars from the roof. Not the morning, though.", "С крыши видны чудесные звёзды. Утро — нет."),
  t("編み物は、夜に向いている趣味です。", "Knitting is a hobby well suited to the night.", "Вязание — хорошее ночное занятие."),
  t("止まった時計も、一日に二回は正しい時刻を指します。", "Even a stopped clock is right twice a day.", "Даже остановившиеся часы дважды в сутки показывают верное время."),
  t("ここでは、また明日、が毎日来ます。", "Here, 'see you tomorrow' comes every day.", "Здесь «до завтра» наступает каждый день."),
  t("患者さんの名前は、なるべく呼んであげましょう。", "Try to call patients by their names.", "Старайтесь называть пациентов по имени."),
  t("休憩も、仕事のうちです。先生以外は。", "Breaks are part of the job. Except for the doctor.", "Перерыв — тоже часть работы. Кроме доктора."),
  t("廊下の壁は、壁です。", "The corridor wall is a wall.", "Стена в коридоре — это стена."),
  t("ツブの瓶は、叩かないでください。リズムよく叩くのは、なおさら。", "Please don't tap Tsubu's bottle. Especially not in a rhythm.", "Не стучите по банке Цубу. Особенно ритмично."),
  t("シフトは、最後まで。", "Finish the shift.", "Смену — до конца."),
  t("プリンの賞味期限：明日", "Pudding best before: tomorrow", "Пудинг годен до: завтра"),
  t("先生の睡眠時間：計測不能", "Doctor's sleep time: unmeasurable", "Время сна доктора: не поддаётся измерению"),
  t("すべての音を消すと、静けさの向こうに何かがいます。", "Turn off every sound, and something waits beyond the silence.", "Выключите все звуки — и за тишиной кто-то окажется."),
];

// ───────────────────────── EMRYS QUIPS ─────────────────────────
const EMRYS_QUIPS = [
  t("……なに。", "...What.", "...Что."),
  t("起きてる。たぶん。", "I'm awake. Probably.", "Я не сплю. Наверное."),
  t("つつくな。カルテが曲がる。", "Don't poke me. You'll bend the chart.", "Не тыкай. Карту помнёшь."),
  t("……コーヒー、冷めてるな。", "...Coffee's gone cold.", "...Кофе остыл."),
  t("診察なら、順番に。", "If you want a checkup, take a number.", "На приём — в порядке очереди."),
  t("眠くない。顔がこういう形なだけだ。", "I'm not sleepy. My face is just shaped like this.", "Я не сонный. Просто у меня такое лицо."),
  t("……あと五分。……冗談だ。", "...Five more minutes. ...Joking.", "...Ещё пять минут. ...Шучу."),
  t("英雄じゃない。夜勤だ。", "I'm not a hero. I'm on nights.", "Я не герой. Я в ночную смену."),
  t("用がないなら、プリンを補充してくれ。", "If you're not busy, restock the pudding.", "Если делать нечего — пополни запас пудинга."),
  t("……ああ。聞いてる。", "...Yeah. I'm listening.", "...Да. Слушаю."),
  t("それは医学的に、つつきすぎだ。", "Medically speaking, that's too much poking.", "С медицинской точки зрения, это перебор тыканья."),
  t("休憩は取った。去年に。", "I took a break. Last year.", "Я брал перерыв. В прошлом году."),
  t("三時三十三分。……いつも通りだ。", "3:33. ...As usual.", "3:33. ...Как обычно."),
  t("患者が先。俺は後でいい。", "Patients first. I can wait.", "Сначала пациенты. Я подожду."),
  t("ドラマは嫌いだ。静かなほうがいい。", "I don't like drama. Quiet is better.", "Не люблю драмы. Лучше тишина."),
  t("……ツブに似てきたって言うなよ。", "...Don't say I'm starting to sound like Tsubu.", "...Только не говори, что я стал похож на Цубу."),
  t("寝不足は治療中だ。経過は不良。", "My sleep deprivation is under treatment. Prognosis: poor.", "Недосып лечится. Прогноз неблагоприятный."),
  t("……大丈夫だ。俺はな。", "...I'm fine. Me, anyway.", "...Я в порядке. Я-то."),
  t("朝まで、ここにいる。", "I'll be here till morning.", "Я здесь до утра."),
  t("……また明日、か。", "...See you tomorrow, huh.", "...До завтра, значит."),
  t("影？ ……あるだろ。たぶん。", "Shadow? ...I have one. Probably.", "Тень? ...Есть, наверное."),
  t("白衣は洗濯した。気持ちの上では。", "I washed the coat. In spirit.", "Халат я постирал. Мысленно."),
  t("無理はしてない。無理が仕事なだけだ。", "I'm not overdoing it. Overdoing it is the job.", "Я не перенапрягаюсь. Перенапряжение — это и есть работа."),
  t("……シフト、終わったら考える。", "...I'll think about it after the shift.", "...Подумаю после смены."),
  t("押しても、早く朝にはならない。", "Poking me won't make morning come faster.", "Сколько ни тыкай, утро быстрее не наступит."),
  t("……俺の顔に何かついてるか。", "...Is there something on my face?", "...У меня что-то на лице?"),
  t("聞こえてる。寝てない。目を閉じてるだけだ。", "I can hear you. I'm not asleep. Just resting my eyes.", "Я слышу. Я не сплю. Просто глаза закрыл."),
  t("医者だ。魔法使いじゃない。地味な方の魔法ならある。", "I'm a doctor, not a wizard. Well. The boring kind of magic.", "Я врач, а не волшебник. Ну, разве что скучная магия."),
];

export const STORY = {
  prologue: PROLOGUE,
  nights: NIGHTS,
  epilogue: EPILOGUE,
  daily: DAILY,
  idle: IDLE,
  examine: EXAMINE,
  anomalies: ANOMALIES,
  loading: LOADING,
  emrys_quips: EMRYS_QUIPS,
};

// ───────────────────────── TSUBU ─────────────────────────
export const TSUBU = {
  greet: [
    t("院長ツブ、出勤しました！ 今日も患者さんを全員治す！", "Chief Physician Tsubu reporting for duty! Tsubu will cure every patient today!", "Главврач Цубу прибыл на смену! Сегодня Цубу всех вылечит!"),
    t("エムリスくん、おはよう！ ツブはずっと起きてたよ！", "Good morning, Emrys! Tsubu was awake the whole time!", "Доброе утро, Эмрис! Цубу совсем не спал!"),
    t("やっほー！ ツブの診察室へようこそ！ 瓶の中だけど！", "Yoo-hoo! Welcome to Tsubu's office! It's a bottle, but still!", "Приветик! Добро пожаловать в кабинет Цубу! Это банка, но всё равно!"),
    t("おっ、来たね！ ツブ、待ってなかったけど待ってた！", "Oh, you're here! Tsubu wasn't waiting, but was totally waiting!", "О, пришёл! Цубу не ждал, но очень ждал!"),
    t("本日の院長回診、開始！ まずはツブのおなかから！", "Chief's rounds begin! Starting with Tsubu's tummy!", "Обход главврача начинается! Начнём с животика Цубу!"),
    t("エムリスくん、顔色わるい！ ツブが診断してあげよう。病名は……「ねむねむ症候群」！", "Emrys, you look pale! Tsubu will diagnose you. The disease is... Sleepy-Sleepy Syndrome!", "Эмрис, ты бледный! Цубу поставит диагноз. Это... синдром сонной сонливости!"),
  ],
  hungry: [
    t("ツブはおなかぺこぺこ！", "Tsubu is starving!", "Цубу голоден!"),
    t("緊急事態！ 院長の血糖値が、だいだいだい低下中！", "Emergency! The Chief's blood sugar is dropping super-mega-fast!", "Тревога! У главврача сахар падает со страшной скоростью!"),
    t("ツブのおなか、心停止寸前！ プリンで蘇生して！", "Tsubu's tummy is about to go into cardiac arrest! Resuscitate it with pudding!", "Животик Цубу на грани остановки сердца! Реанимируй пудингом!"),
    t("ぐうう〜。今のはツブじゃないよ。おなかが勝手に言ったの。", "Grrrrumble. That wasn't Tsubu. The tummy said it on its own.", "Урррр. Это не Цубу. Это животик сам сказал."),
    t("院長命令！ ただちに食事を処方せよ！", "Chief's orders! Prescribe food immediately!", "Приказ главврача! Немедленно выписать еду!"),
  ],
  full: [
    t("ツブ、もうおなかいっぱい！ 膨張性……ぽんぽこりん症！", "Tsubu is stuffed! A case of... acute tummy-swelling-itis!", "Цубу объелся! Острый... пузораздутит!"),
    t("もう入らない……あと一口だけ……いや入らない……。", "Can't fit any more... just one more bite... no, can't fit...", "Больше не влезет... ещё кусочек... нет, не влезет..."),
    t("満腹！ ツブの胃袋は、今、満床です！", "Full! Tsubu's stomach has no beds available!", "Сыт! В желудке у Цубу мест нет!"),
    t("ふう。院長、しばし安静にします。", "Phew. The Chief will now rest quietly for a bit.", "Уф. Главврачу нужен покой."),
  ],
  eat: [
    t("もぐもぐ！ おいしい！ 診断：おいしい！", "Munch munch! Tasty! Diagnosis: tasty!", "Ням-ням! Вкусно! Диагноз: вкусно!"),
    t("いただきまーす！ ……ごちそうさまでした！", "Itadakimaaasu! ...Thank you for the meal!", "Приятного аппетита Цубу! ...Спасибо, было вкусно!"),
    t("ツブの細胞が、喜んでる！ 細胞分裂してる！", "Tsubu's cells are rejoicing! They're doing cell division!", "Клетки Цубу ликуют! Они делятся!"),
    t("栄養、注入完了！", "Nutrient infusion complete!", "Вливание питательных веществ завершено!"),
    t("んむ。ふつうにおいしい。院長は、ふつうも好き！", "Mm. Normal tasty. The Chief likes normal too!", "Мм. Нормально вкусно. Главврач и нормальное любит!"),
  ],
  eat_fav: [
    t("プリンだああああ！ ツブ、生きててよかった！", "PUDDIIING! Tsubu's so glad to be alive!", "ПУДИИИНГ! Как хорошо, что Цубу живой!"),
    t("ぷるぷる！ これぞ、伝説の万能薬！", "Jiggly-jiggly! This is the legendary cure-all!", "Дрожит-дрожит! Вот оно, легендарное лекарство от всего!"),
    t("カラメルの部分は、ツブの心臓に直接効く！", "The caramel part goes straight to Tsubu's heart!", "Карамель действует прямо на сердце Цубу!"),
    t("エムリスくん、天才！ ノーベル医学賞！", "Emrys, you're a genius! Nobel Prize in Medicine!", "Эмрис, ты гений! Нобелевская премия по медицине!"),
    t("しあわせ……ツブ、このまま退院しちゃうかも……。", "So happy... Tsubu might just get discharged like this...", "Какое счастье... Цубу сейчас прямо выпишется..."),
  ],
  eat_dislike: [
    t("う゛っ。これ、ピーマン……？ ツブ、アレルギー！ たぶん！", "Ugh. Is this green pepper...? Tsubu is allergic! Probably!", "Фу. Это перец...? У Цубу аллергия! Наверное!"),
    t("院長は、これを、却下します。", "The Chief hereby rejects this.", "Главврач это отклоняет."),
    t("にがい！ これは薬！ ごはんじゃない！", "Bitter! This is medicine! Not food!", "Горько! Это лекарство! А не еда!"),
    t("……ツブ、食べた。えらい？ えらいって言って！", "...Tsubu ate it. Good job, right? Say good job!", "...Цубу съел. Молодец ведь? Скажи, что молодец!"),
  ],
  sad: [
    t("ツブ、しょんぼり……。", "Tsubu is feeling droopy...", "Цубу грустит..."),
    t("院長だって、さみしくなる日もある……。", "Even Chief Physicians get lonely sometimes...", "Даже главврачам бывает одиноко..."),
    t("瓶の中、ちょっとせまい気がする……。", "The bottle feels a little small today...", "Банка сегодня какая-то тесная..."),
    t("エムリスくん、ツブのこと、忘れてない？", "Emrys, you didn't forget about Tsubu, did you?", "Эмрис, ты ведь не забыл про Цубу?"),
  ],
  happy: [
    t("ツブ、ごきげん！ 院長スマイル、全開！", "Tsubu is in a great mood! Chief's smile at full power!", "Цубу в отличном настроении! Улыбка главврача на максимум!"),
    t("るんるん！ ツブの心拍、ぴょんぴょん！", "La-la-la! Tsubu's heartbeat is going boing-boing!", "Ля-ля-ля! Сердечко Цубу прыгает!"),
    t("今日はいい夜！ 毎晩いい夜！", "Tonight's a good night! Every night's a good night!", "Хорошая ночь! Каждая ночь — хорошая!"),
    t("エムリスくんも、笑って！ ……それ笑ってる？", "Emrys, smile too! ...Is that a smile?", "Эмрис, улыбнись! ...Это улыбка?"),
  ],
  attention: [
    t("エムリスくーん！ ツブ、ここ！ ここにいる！", "Emryyyys! Tsubu's here! Right here!", "Эмри-и-ис! Цубу тут! Вот тут!"),
    t("ねえねえ、院長の話、聞いて！ 大事な話！ ……忘れた！", "Hey hey, listen to the Chief! It's important! ...Forgot it!", "Эй, послушай главврача! Это важно! ...Забыл!"),
    t("瓶をトントンしてもいいよ！ ツブ、トントン好き！", "You can tap on the bottle! Tsubu likes taps!", "Можно постучать по банке! Цубу любит тук-тук!"),
    t("院長回診の時間です！ 患者はエムリスくん！", "Time for Chief's rounds! The patient is Emrys!", "Время обхода! Пациент — Эмрис!"),
  ],
  sleep: [
    t("すぴー……ぷりん……すぴー……。", "Zzz... pudding... zzz...", "Хррр... пудинг... хррр..."),
    t("むにゃ……院長は……ねてない……。", "Mmnya... the Chief is... not asleep...", "Мням... главврач... не спит..."),
    t("……すう……すう……。", "...shh...shh...", "...сопит..."),
    t("……ツブ、夢でも診察してる……。", "...Tsubu is doing checkups in its dreams...", "...Цубу и во сне принимает пациентов..."),
  ],
  wake_grumpy: [
    t("むう！ 院長の睡眠を妨害したな！ 診療報酬、減額！", "Hmph! You disturbed the Chief's sleep! Your pay is docked!", "Хм! Нарушил сон главврача! Штраф!"),
    t("まだ夜だよ……。……ずっと夜だけど……。", "It's still night... ...It's always night, but...", "Ещё ночь... ...Хотя ночь всегда..."),
    t("ツブ、起きた。起きたけど、機嫌は寝てる。", "Tsubu's awake. Awake, but the mood is still asleep.", "Цубу проснулся. Но настроение ещё спит."),
    t("ふあああ……プリンの夢、途中だったのに！", "Fwaaah... Tsubu was in the middle of a pudding dream!", "Ааах... Цубу недосмотрел сон про пудинг!"),
  ],
  sick: [
    t("ツブ、ちょっと……ぐあい、わるい……。慢性急性ぐったり炎……。", "Tsubu feels... kinda... bad... Chronic acute floppy-itis...", "Цубу как-то... нехорошо... Хронический острый вялит..."),
    t("おでこの十字が、ちかちかする……。", "The cross on Tsubu's head is flickering...", "Крестик на лбу у Цубу мигает..."),
    t("院長、入院します……。瓶の中に……。", "The Chief is admitting itself... into the bottle...", "Главврач ложится в больницу... в банку..."),
    t("けほっ。……これは、重度の、プリン欠乏症……。", "Cough. ...This is a severe case of... pudding deficiency...", "Кхе. ...Это тяжёлая... пудинговая недостаточность..."),
  ],
  medicine: [
    t("おくすり……ツブ、ちゃんと飲める。院長だから。", "Medicine... Tsubu can take it. Tsubu's the Chief.", "Лекарство... Цубу выпьет. Цубу же главврач."),
    t("ごっくん！ ……にがーい！ でも院長は泣かない！", "Gulp! ...So bitter! But the Chief doesn't cry!", "Глоть! ...Горько! Но главврачи не плачут!"),
    t("投薬確認！ ツブ、自分で自分にサインします！", "Medication confirmed! Tsubu signs off on Tsubu!", "Приём лекарства подтверждён! Цубу расписывается сам за себя!"),
    t("薬は、飲んだあとにプリンを飲むと効くんだよ。医学的に。", "Medicine works better if you have pudding right after. Medically.", "Лекарство лучше действует, если заесть пудингом. Медицински."),
  ],
  recover: [
    t("全快！ 院長ツブ、完全復活！", "Full recovery! Chief Physician Tsubu is back!", "Полное выздоровление! Главврач Цубу вернулся!"),
    t("見て見て！ 十字がぴかぴか！", "Look look! The cross is all shiny!", "Смотри! Крестик сияет!"),
    t("エムリスくんの治療、満点！ ツブが保証する！", "Emrys's treatment gets full marks! Tsubu guarantees it!", "Лечение Эмриса — на пятёрку! Цубу гарантирует!"),
    t("治った！ ……昨日も治った気がする！", "Cured! ...Tsubu feels like it got cured yesterday too!", "Вылечился! ...Кажется, вчера тоже вылечился!"),
  ],
  clean: [
    t("ぴかぴか！ 院長、無菌状態！", "Squeaky clean! The Chief is fully sterile!", "Чистенький! Главврач стерилен!"),
    t("あわあわ〜！ ツブ、消毒されちゃう〜！", "Bubbly-bubbly! Tsubu's getting disinfected!", "Пена-пена! Цубу дезинфицируют!"),
    t("きれいになった！ 瓶もツブも、新品同様！", "All clean! Bottle and Tsubu, good as new!", "Как новенький! И банка, и Цубу!"),
    t("ふう、さっぱり。衛生管理は院長の基本！", "Phew, refreshing. Hygiene is basic Chief stuff!", "Ух, свежесть. Гигиена — основа главврача!"),
  ],
  dirty: [
    t("瓶の中、ちょっとプリンくさい……。いい匂いだけど……。", "The bottle smells kinda like pudding... In a nice way, but...", "В банке пахнет пудингом... Приятно, но..."),
    t("院長、院内感染の危機！ そうじ、そうじ！", "The Chief is at risk of infection! Clean, clean!", "Главврачу грозит внутрибольничная инфекция! Уборка, уборка!"),
    t("ツブ、ちょっとべたべた……。", "Tsubu's a little sticky...", "Цубу немного липкий..."),
    t("ガラスがくもって、外が見えない！ ……外、もともと暗いけど！", "The glass is foggy, Tsubu can't see out! ...Outside is always dark anyway!", "Стекло запотело, Цубу ничего не видит! ...Хотя снаружи и так темно!"),
  ],
  pet: [
    t("えへへ。なでなで、好き！", "Hehe. Tsubu likes pats!", "Хи-хи. Цубу любит, когда гладят!"),
    t("院長への敬意、受け取りました！", "Respect for the Chief: received!", "Уважение к главврачу принято!"),
    t("エムリスくんの手、つめたい。でも、やさしい。", "Emrys's hand is cold. But gentle.", "У Эмриса холодная рука. Но добрая."),
    t("ふにゃ〜。ツブ、とろける……プリンみたいに……。", "Fwaaa. Tsubu's melting... like pudding...", "Мяу-у. Цубу тает... как пудинг..."),
    t("もっと！ 右！ ちょっと左！ そこ！", "More! Right! A little left! There!", "Ещё! Правее! Чуть левее! Вот тут!"),
  ],
  pet_too_much: [
    t("なですぎ！ 院長の頭皮が摩耗する！", "Too many pats! The Chief's scalp is wearing down!", "Слишком много! У главврача сотрётся макушка!"),
    t("もう十分！ ツブの十字がずれちゃう！", "That's enough! Tsubu's cross is going crooked!", "Хватит! У Цубу крестик съедет!"),
    t("ストップ！ なでなで中毒の疑い！", "Stop! Suspected pat addiction!", "Стоп! Подозрение на зависимость от поглаживаний!"),
    t("むー！ 院長はペットじゃない！ ……ちょっとだけペット！", "Hmph! The Chief isn't a pet! ...Okay, a little bit a pet!", "Хм! Главврач не питомец! ...Ну, чуть-чуть питомец!"),
  ],
  play: [
    t("あそぼ！ あそぼ！ 院長命令で、あそぼ！", "Let's play! Let's play! Chief's orders, let's play!", "Давай играть! Приказ главврача — играть!"),
    t("ツブ、ころころするの得意！ 見てて！", "Tsubu is great at rolling! Watch!", "Цубу отлично катается! Смотри!"),
    t("きゃー！ たのしい！ 心拍数、上昇！", "Waaah! Fun! Heart rate rising!", "Ура! Весело! Пульс растёт!"),
    t("エムリスくん、今のツブ、何点？ 百点？ 百点だよね！", "Emrys, how many points was that? A hundred? It was a hundred!", "Эмрис, сколько баллов? Сто? Сто ведь!"),
  ],
  toy_new: [
    t("新しいおもちゃ！ ツブ、これを「医療機器」に認定します！", "A new toy! Tsubu certifies this as a medical device!", "Новая игрушка! Цубу признаёт её медицинским оборудованием!"),
    t("わあ！ これ、ツブの？ ほんとに？ 返さないよ？", "Wow! Is this for Tsubu? Really? Tsubu's not giving it back!", "Ух ты! Это Цубу? Правда? Цубу не отдаст!"),
    t("さっそく検査！ ……結果：たのしい！", "Testing it right away! ...Result: fun!", "Сразу на анализ! ...Результат: весело!"),
    t("宝物、ひとつ増えた！ 前の宝物は……どこだっけ？", "One more treasure! Where was the last treasure again...?", "Ещё одно сокровище! А где прошлое сокровище...?"),
  ],
  decor: [
    t("おしゃれな瓶！ 院長室にふさわしい！", "What a stylish bottle! Fit for a Chief's office!", "Какая стильная банка! Достойна кабинета главврача!"),
    t("模様替え！ ツブの病院、グレードアップ！", "Redecorated! Tsubu's hospital got an upgrade!", "Перестановка! Больница Цубу стала лучше!"),
    t("きれい……。ここ、ずっとこのままがいいな。", "Pretty... Tsubu wants it to stay like this forever.", "Красиво... Пусть всегда так будет."),
    t("いいね！ 患者さんもきっと喜ぶ！ ……ツブしかいないけど！", "Nice! Patients will love it! ...It's just Tsubu, but still!", "Здорово! Пациенты обрадуются! ...Хотя тут только Цубу!"),
  ],
  neglected_return: [
    t("……おそい！ ツブ、ずっと待ってた！ 何年も！", "...You're late! Tsubu waited forever! For years!", "...Поздно! Цубу ждал целую вечность! Годами!"),
    t("エムリスくん！ 消えちゃったかと思った！", "Emrys! Tsubu thought you disappeared!", "Эмрис! Цубу думал, ты исчез!"),
    t("……ふん。べつに、さみしくなかったし。……ちょっとだけ。", "...Hmph. Tsubu wasn't lonely or anything. ...Only a little.", "...Хм. Цубу совсем не скучал. ...Чуть-чуть только."),
    t("院長、ひとりで夜勤してたんだからね！", "The Chief was working the night shift all alone, you know!", "Главврач, между прочим, один дежурил!"),
  ],
  remembers_food: [
    t("ツブ、覚えてる！ この前、{food}くれたよね！", "Tsubu remembers! You gave Tsubu {food} last time!", "Цубу помнит! В прошлый раз ты дал Цубу {food}!"),
    t("{food}、また食べたいなあ。昨日のやつ。……昨日だよね？", "Tsubu wants {food} again. Like yesterday. ...It was yesterday, right?", "Хочу опять {food}. Как вчера. ...Это ведь было вчера?"),
    t("院長の記録によると、前回の処方は{food}！", "According to the Chief's records, the last prescription was {food}!", "Согласно записям главврача, в прошлый раз прописали {food}!"),
    t("{food}の味、ツブの細胞が覚えてる！", "Tsubu's cells remember the taste of {food}!", "Клетки Цубу помнят вкус: {food}!"),
  ],
  remembers_neglect: [
    t("前にね、ずーっと来なかった日があったよ。ツブ、覚えてるもん。", "There was a day you didn't come for a long, long time. Tsubu remembers.", "Был день, когда ты очень-очень долго не приходил. Цубу помнит."),
    t("また来なくなったら、ツブ、瓶ごと探しに行くからね。", "If you stop coming again, Tsubu will go looking for you, bottle and all.", "Если опять пропадёшь, Цубу пойдёт тебя искать. Прямо в банке."),
    t("院長は、待つのが仕事じゃないの。……でも待ってた。", "Waiting isn't the Chief's job. ...But Tsubu waited.", "Ждать — не работа главврача. ...Но Цубу ждал."),
    t("ツブ、昨日のことは忘れるけど、さみしかったのは覚えてる。", "Tsubu forgets yesterday, but remembers being lonely.", "Цубу забывает вчера, но помнит, как было одиноко."),
  ],
  late_night: [
    t("ねえ、まだ三時三十三分？ ツブ、時計よめないけど。", "Hey, is it still 3:33? Tsubu can't read clocks, though.", "Эй, всё ещё 3:33? Хотя Цубу не умеет читать часы."),
    t("夜って、ずっと続くんだね。ツブ、夜好きだからいいけど！", "The night just keeps going, huh. Tsubu likes nights, so it's fine!", "Ночь всё не кончается. Но Цубу любит ночь, так что ладно!"),
    t("エムリスくん、ちょっと寝ても、ツブが起こしてあげるよ。", "Emrys, if you nap a little, Tsubu will wake you up.", "Эмрис, если поспишь немножко, Цубу тебя разбудит."),
    t("しーっ。夜中は、静かにすると何か聞こえるよ。", "Shhh. In the middle of the night, if it's quiet, you can hear something.", "Тсс. Глубокой ночью, если тихо, кое-что слышно."),
  ],
  eerie: [
    t("エムリスくん、ここに来たの、ツブより前？ 後？ ……どっちでもいっか！", "Emrys, did you come here before Tsubu or after? ...Doesn't matter!", "Эмрис, ты пришёл сюда раньше Цубу или позже? ...Неважно!"),
    t("ツブね、エムリスくんの心臓の音、聞いたことないよ。", "You know, Tsubu has never heard Emrys's heartbeat.", "А Цубу ни разу не слышал, как бьётся сердце Эмриса."),
    t("退院した人って、どこに行くの？ 朝のほう？", "Where do discharged people go? Toward the morning?", "Куда уходят выписанные? В сторону утра?"),
    t("四番ベッドの人も、プリン好きかな。ツブ、あげに行こうかな。", "Does the person in Bed 4 like pudding too? Maybe Tsubu should bring them some.", "А человек с четвёртой койки любит пудинг? Может, Цубу отнести ему?"),
    t("ツブ、この瓶に入る前のこと、覚えてない。エムリスくんは？", "Tsubu doesn't remember anything from before the bottle. What about you, Emrys?", "Цубу не помнит, что было до банки. А ты, Эмрис?"),
    t("あのね、エムリスくんの影、ツブの瓶に入ってるよ。……うそ！", "Hey, Emrys's shadow is inside Tsubu's bottle. ...Just kidding!", "Слушай, тень Эмриса сидит у Цубу в банке. ...Шучу!"),
  ],
  bond_up: [
    t("エムリスくん、ツブの副院長に任命します！", "Emrys, Tsubu appoints you Deputy Chief!", "Эмрис, Цубу назначает тебя заместителем главврача!"),
    t("ツブ、エムリスくんのこと、だーいすき！", "Tsubu loooves Emrys!", "Цубу о-очень любит Эмриса!"),
    t("ずっと一緒にいようね。夜が終わらなくても！", "Let's stay together forever. Even if the night never ends!", "Будем всегда вместе. Даже если ночь не кончится!"),
    t("ツブとエムリスくん、最強の医療チーム！", "Tsubu and Emrys, the ultimate medical team!", "Цубу и Эмрис — лучшая медицинская команда!"),
  ],
  hint_shiny: [
    t("ツブね、むかし、ぴかぴかしたもの飲みこんだの。おいしくなかった。", "A long time ago, Tsubu swallowed something shiny. It wasn't tasty.", "Давным-давно Цубу проглотил что-то блестящее. Было невкусно."),
    t("おなかの奥で、たまにカチャってなるの。消化不良かな。", "Sometimes there's a little clink deep in Tsubu's tummy. Indigestion, maybe.", "Иногда в глубине животика у Цубу что-то звякает. Несварение, наверное."),
    t("トン、トン、トン……トン……トン、トン、トン。このリズム、おなかがむずむずする！", "Tap, tap, tap... tap... tap, tap, tap. That rhythm makes Tsubu's tummy tickle!", "Тук, тук, тук... тук... тук, тук, тук. От этого ритма у Цубу щекотно в животике!"),
    t("ぴかぴかのやつ、誰かの落としものだった気がする。返したほうがいい？", "Tsubu thinks the shiny thing was something somebody dropped. Should Tsubu give it back?", "Цубу кажется, блестяшку кто-то потерял. Может, вернуть?"),
    t("三回、一回、三回。ツブの好きな数字！ なんでかは忘れた！", "Three, one, three. Tsubu's favorite numbers! Tsubu forgot why!", "Три, один, три. Любимые числа Цубу! Почему — забыл!"),
    t("院長の体内には、ひみつの医療器具が入ってるのだ。えっへん。……出し方は知らない。", "The Chief has a secret medical instrument inside. Ahem. ...Tsubu doesn't know how to get it out.", "Внутри главврача спрятан секретный инструмент. Вот так. ...Как достать — Цубу не знает."),
  ],
  key_cough: [
    B("……ひっく。", "...Hic.", "...Ик."),
    E("……どうした。", "...What's wrong.", "...Что такое."),
    B("ひっく！ ひっく！ 院長、急性しゃっくり炎！ ひっく！", "Hic! Hic! The Chief has acute hiccup-itis! Hic!", "Ик! Ик! У главврача острый икотит! Ик!"),
    B("おなかの奥のぴかぴかが、出たがってる……！ ひっ……", "The shiny thing deep in Tsubu's tummy wants to come out...! Hic...", "Блестяшка в глубине животика хочет наружу...! И..."),
    N("カラン。瓶の底に、小さな金属が落ちた。", "Clink. Something small and metal drops to the bottom of the bottle.", "Дзынь. На дно банки упало что-то маленькое и металлическое."),
    E("……鍵の、持ち手か。錆びてる。", "...The bow of a key. Rusted.", "...Головка ключа. Ржавая.", "wary"),
    B("ふう！ すっきり！ それ、ツブのじゃないよ。たぶん、エムリスくんの。", "Phew! That feels better! That's not Tsubu's. Probably yours, Emrys.", "Уф! Полегчало! Это не Цубу. Наверное, твоё, Эмрис."),
    E("……俺の？", "...Mine?", "...Моё?", "think"),
    B("ずーっと前に、エムリスくんが落としたの、ツブが拾って食べたの！ ……覚えてないけど！", "A long, long time ago you dropped it, and Tsubu picked it up and ate it! ...Tsubu doesn't remember, though!", "Давным-давно ты это уронил, а Цубу подобрал и съел! ...Хотя Цубу не помнит!"),
    E("……預かっておく。", "...I'll hold on to it.", "...Сохраню.", "ponder"),
  ],
  stethoscope: [
    B("院長の健康診断？ いいよ！ ツブ、健康優良児！", "A checkup for the Chief? Sure! Tsubu is the picture of health!", "Осмотр главврача? Давай! Цубу — образец здоровья!"),
    E("……静かに。", "...Quiet.", "...Тихо."),
    N("聴診器をあてる。……何も聞こえない。", "He places the stethoscope. ...Nothing.", "Он прикладывает стетоскоп. ...Ничего."),
    E("……ツブ。心臓、どこだ。", "...Tsubu. Where's your heart?", "...Цубу. Где у тебя сердце?", "wary"),
    B("あるよ！ ツブの心臓は、すっごく静かなタイプなの！ 省エネ！", "It's there! Tsubu's heart is the super-quiet kind! Energy saving!", "Есть! Просто сердце у Цубу очень тихое! Энергосберегающее!"),
    B("エムリスくんのも、静かなタイプでしょ？ おそろい！", "Yours is the quiet kind too, right, Emrys? We match!", "У тебя ведь тоже тихое, Эмрис? Одинаковые!"),
    E("……", "......", "......", "ponder"),
    E("……健康だ。たぶん。", "...You're healthy. Probably.", "...Здоров. Наверное."),
    B("やったー！ 院長、今日も現役！", "Yay! The Chief stays on active duty!", "Ура! Главврач по-прежнему в строю!"),
  ],
};
