// 夜光カルテ — Black Door conversation data.
// The Occupant (住人). Narrative data only; the engine lives elsewhere.
// Helper L() only builds {ja,en,ru} objects; the exported shape is plain data.

export const DOOR_META = { name: { ja: "住人", en: "the occupant", ru: "Жилец" }, unknownName: { ja: "？？？", en: "???", ru: "???" } };

const L = (ja, en, ru) => ({ ja, en, ru });
const N = {};

// ------------------------------------------------------------------
// GREETINGS (top to bottom, first passing req wins)
// ------------------------------------------------------------------
const GREETINGS = [
  { req: "door_visits==1", node: "g_first" },
  { req: "ending_both && !d_ack_both", node: "g_e_both" },
  { req: "ending_dawn && !d_ack_dawn", node: "g_e_dawn" },
  { req: "ending_forget && !d_ack_forget", node: "g_e_forget" },
  { req: "ending_tsubu && !d_ack_tsubu", node: "g_e_tsubu" },
  { req: "ending_shift && !d_ack_shift", node: "g_e_shift" },
  { req: "door_left_last==1 && door_left_mid>=4 && !d_g_leftmany", node: "g_leftmany" },
  { req: "door_left_last==1", node: "g_left" },
  { req: "door_visits==2", node: "g_second" },
  { req: "night==6 && !d_g_n6", node: "g_n6" },
  { req: "room4_seen && !d_g_room4", node: "g_room4" },
  { req: "tsubu_sick_neglect>=5 && d_g_neg==1", node: "g_neglect2" },
  { req: "tsubu_sick_neglect>=2 && !d_g_neg", node: "g_neglect" },
  { req: "clock_taps>=33 && !d_g_clk2", node: "g_clock2" },
  { req: "clock_taps>=10 && !d_g_clk", node: "g_clock" },
  { req: "silence && !d_g_sil", node: "g_silence" },
  { req: "door_visits>=25 && !d_g_25", node: "g_v25" },
  { req: "door_visits>=10 && !d_g_10", node: "g_v10" },
  { req: "mg_fails>=10 && !d_g_fails", node: "g_fails" },
  { req: "mg_best_rank_s>=3 && !d_g_srank", node: "g_srank" },
  { req: "anomalies>=7 && !d_g_anom", node: "g_anom" },
  { req: "real_hour==3 && !d_g_r3", node: "g_r3" },
  { req: "real_hour>=2 && real_hour<=4", node: "g_late" },
  { req: "real_hour>=9 && real_hour<=16 && !d_g_day", node: "g_day" },
  { req: "real_hour>=9 && real_hour<=16 && d_g_day && d_def==2", node: "g_day2" },
  { req: "silence && d_def==3", node: "g_silence2" },
  { req: "has_pudding && !d_g_pud && door_visits>=3", node: "g_pud" },
  { req: "d_def==0", node: "g_d0" },
  { req: "d_def==1", node: "g_d1" },
  { req: "d_def==2", node: "g_d2" },
  { req: "d_def==3", node: "g_d3" },
  { req: "d_def==4", node: "g_d4" },
  { req: "", node: "g_default" },
];

Object.assign(N, {
  // ---- first visit
  g_first: { who: "narr", t: L("黒い扉。取っ手はない。下の隙間から、冷たい暗がりがにじみ出ている。", "A black door. No handle. Cold darkness seeps out from the gap beneath it.", "Чёрная дверь. Без ручки. Из щели под ней сочится холодная темнота."), next: "g_first_2" },
  g_first_2: { who: "voice", t: L("……三十八。", "……thirty-eight.", "……Тридцать восемь."), next: "g_first_3" },
  g_first_3: { who: "emrys", emo: "wary", t: L("……三十八、何が。", "……Thirty-eight what.", "……Тридцать восемь чего."), next: "g_first_4" },
  g_first_4: { who: "voice", t: L("歩数です。受付の角からここまで。あなた、右足から歩き出す癖がありますね。……どうでもいいことですけど。数えてしまうんだ、つい。", "steps. from the corner by reception to here. you lead with your right foot. ……it doesn't matter. i just count things. i can't help it.", "Шагов. От угла у регистратуры досюда. Вы ступаете с правой ноги. ……Это неважно. Я, видите ли, считаю. Ничего не могу с собой поделать."), next: "g_first_5" },
  g_first_5: { who: "emrys", emo: "think", t: L("……この部屋に入院患者はいないはずだが。", "……This room isn't supposed to have a patient.", "……В этой палате не должно быть пациентов."), next: "g_first_6" },
  g_first_6: { who: "voice", t: L("患者じゃありません。住んでいるだけです。……ところで、いま何時ですか。", "i'm not a patient. i just live here. ……what time is it.", "Я не пациент. Я здесь просто живу. ……Который час, позвольте спросить?"), next: "g_first_7" },
  g_first_7: { who: "narr", t: L("エムリスは腕時計に目を落とす。秒針は、動いているように見える。", "Emrys glances at his watch. The second hand appears to be moving.", "Эмрис смотрит на часы. Секундная стрелка как будто движется."), next: "g_first_8" },
  g_first_8: { who: "emrys", emo: "normal", t: L("……三時三十三分。", "……Three thirty-three.", "……Три тридцать три."), next: "g_first_9" },
  g_first_9: { who: "voice", t: L("そうですか。……そうでしょうね。", "yes. ……it would be.", "Вот как. ……Разумеется."), next: "hub" },

  // ---- second visit
  g_second: { who: "voice", t: L("また来た。前回は四分十二秒いましたね。今日はもう少し長くいてください。……命令じゃないです。統計の都合です。", "you came back. last time you stayed four minutes and twelve seconds. stay a little longer today. ……it isn't an order. it's for my statistics.", "Вы вернулись. В прошлый раз пробыли четыре минуты двенадцать секунд. Сегодня побудьте подольше. ……Это не приказ. Это для статистики."), next: "g_second_2" },
  g_second_2: { who: "emrys", emo: "crossed", t: L("統計を取ってるのか。", "You keep statistics.", "Ты ведёшь статистику."), next: "g_second_3" },
  g_second_3: { who: "voice", t: L("暇なので。ここ、テレビもないし。", "i have time. there's no television in here.", "У меня много времени. Телевизора здесь нет."), next: "hub" },

  // ---- walked away last time
  g_left: { who: "voice", t: L("……前回、途中で帰りましたね。", "……you left in the middle, last time.", "……В прошлый раз вы ушли посреди разговора."), next: "g_left_2" },
  g_left_2: { who: "emrys", emo: "normal", t: L("急患だった。", "Emergency.", "Срочный вызов."), next: "g_left_3" },
  g_left_3: { who: "voice", t: L("嘘です。足音が急いでなかった。百二歩、ゆっくりでした。……べつに、怒ってません。怒ってないよ。", "liar. your steps weren't in a hurry. a hundred and two of them. slow. ……i'm not upset. i'm not.", "Неправда. Шаги ваши не спешили. Сто два шага, медленных. ……Я не сержусь. Нисколько."), choices: [
    { t: L("……悪かった。", "……Sorry.", "……Извини."), next: "g_left_sorry", add: { d_trust: 1 } },
    { t: L("勤務中だ。いつでも途中で帰る。", "I'm on shift. I'll always leave in the middle.", "Я на смене. Я всегда буду уходить посреди."), next: "g_left_cold", add: { d_cold: 1 } },
  ] },
  g_left_sorry: { who: "voice", t: L("……謝られると、数え直さないといけない。いいです。今日のぶんから引いておきます。", "……now i have to recount. fine. i'll subtract it from today.", "……Теперь придётся пересчитывать. Ладно. Вычту из сегодняшнего."), next: "hub" },
  g_left_cold: { who: "voice", t: L("そう。じゃあ私は、いつでも途中から待っています。お互いさまだ。", "fine. then i'll always be waiting from the middle. that's fair.", "Что ж. Тогда я всегда буду ждать с середины. Это честно."), next: "hub" },

  g_leftmany: { who: "voice", t: L("また途中で。これで何回目か、数えるのはやめました。……嘘です。やめたことなんて一度もない。", "again. in the middle. i've stopped counting how many times. ……that's a lie. i have never once stopped counting.", "Опять посреди. Я перестал считать, в который раз. ……Ложь. Я ни разу в жизни не переставал считать."), set: { d_g_leftmany: 1 }, next: "g_leftmany_2" },
  g_leftmany_2: { who: "voice", t: L("あなたが歩き去るとき、扉の下の暗がりが少し伸びるんです。追いかけるみたいに。みっともないですね。", "when you walk away, the dark under the door stretches a little. like it's following you. it's embarrassing.", "Когда вы уходите, темнота под дверью чуть вытягивается. Будто бежит следом. Неприлично, право."), next: "g_leftmany_3" },
  g_leftmany_3: { who: "emrys", emo: "ponder", t: L("……今日は最後までいる。たぶん。", "……I'll stay to the end today. Probably.", "……Сегодня останусь до конца. Наверное."), next: "hub" },

  // ---- night 6
  g_n6: { who: "voice", t: L("……終わったんでしょう。向こうの話は。外の、大きいほうの話。", "……it's over, isn't it. the story out there. the big one.", "……Кончилось, да? Та история, снаружи. Большая."), set: { d_g_n6: 1 }, next: "g_n6_2" },
  g_n6_2: { who: "voice", t: L("なのに、あなたはまだここにいる。私も。……よかった。いや。わからない。", "and you're still here. so am i. ……good. no. i don't know.", "А вы всё ещё здесь. И я. ……Хорошо. Нет. Не знаю."), next: "g_n6_3" },
  g_n6_3: { who: "emrys", emo: "normal", t: L("夜勤に終わりはない。そういう契約だ。", "Night shift doesn't end. It's in the contract.", "Ночная смена не кончается. Так в договоре."), next: "g_n6_4" },
  g_n6_4: { who: "voice", t: L("契約書、読みました？　いちばん下の、小さい字のところまで。", "did you read the contract. all the way to the small print at the bottom.", "Вы читали договор? До самого мелкого шрифта внизу?"), next: "hub" },

  // ---- bed 4
  g_room4: { who: "voice", t: L("……四番のベッドに行きましたね。", "……you went to bed four.", "……Вы ходили к четвёртой койке."), set: { d_g_room4: 1 }, next: "g_room4_2" },
  g_room4_2: { who: "emrys", emo: "wary", t: L("病棟だ。どこにでも行く。", "It's a ward. I go everywhere.", "Это отделение. Я хожу везде."), next: "g_room4_3" },
  g_room4_3: { who: "voice", t: L("名札、読んだでしょう。", "you read the tag.", "Вы прочли бирку."), choices: [
    { t: L("……よくある名前だ。", "……It's a common name.", "……Распространённая фамилия."), next: "g_room4_common", add: { d_refuse: 1 } },
    { t: L("……入院した覚えはない。", "……I don't remember being admitted.", "……Я не помню, чтобы меня клали."), next: "g_room4_honest", add: { d_truth: 1 } },
    { t: L("カーテンは開けなかった。", "I didn't open the curtain.", "Занавеску я не открывал."), next: "g_room4_curtain", add: { d_truth: 1, d_trust: 1 } },
  ] },
  g_room4_common: { who: "voice", t: L("そうですか。よくある名前。……ええ、ほんとうに、よくある。", "is it. a common name. ……yes. very common. here.", "Вот как. Распространённая. ……Да. Здесь — очень."), next: "hub" },
  g_room4_honest: { who: "voice", t: L("……覚えていないのは、悪いことじゃありません。鍵を返しただけです。", "……not remembering isn't a crime. you just returned a key.", "……Не помнить — не преступление. Вы просто вернули ключ."), next: "hub" },
  g_room4_curtain: { who: "voice", t: L("賢い。カーテンはね、閉まっているあいだは、中に何があっても嘘にならないんです。", "smart. as long as a curtain is closed, nothing behind it is a lie yet.", "Разумно. Пока занавеска задёрнута, ничто за ней ещё не стало правдой."), next: "hub" },

  // ---- Tsubu neglect
  g_neglect: { who: "voice", t: L("あの小さいのが、また具合を悪くしていましたね。壁ごしに聞こえました。「ツブは元気だよ」って。元気じゃないときに限って、そう言うんです。", "the little one was sick again. i heard it through the walls. 'tsubu is fine,' it said. it only says that when it isn't.", "Малыш опять хворал. Я слышал сквозь стены: «Цубу в порядке!» Он так говорит, только когда не в порядке."), set: { d_g_neg: 1 }, next: "g_neglect_2" },
  g_neglect_2: { who: "emrys", emo: "annoyed", t: L("……知ってる。", "……I know.", "……Знаю."), next: "g_neglect_3" },
  g_neglect_3: { who: "voice", t: L("あなたは、知っているのに何もしないことを、たくさん持っていますね。ポケットが重そうだ。", "you know a lot of things you don't act on. your pockets must be heavy.", "Вы много знаете такого, с чем ничего не делаете. Карманы, должно быть, тяжёлые."), next: "hub" },
  g_neglect2: { who: "voice", t: L("五回。あの子が倒れた回数です。私は数えるのが仕事みたいなものだから、言いますけど。", "five. that's how many times it has collapsed. counting is more or less my job, so i'm telling you.", "Пять. Столько раз малыш падал. Считать — почти моя служба, потому и говорю."), set: { d_g_neg: 2 }, next: "g_neglect2_2" },
  g_neglect2_2: { who: "voice", t: L("患者は全員助けるのに、自分の瓶の中のものは後回し。……医者って、そういうものですか。それとも、あなたがそういうものなんですか。", "you save every patient and leave the thing in your own bottle for later. ……is that what doctors are. or is that just you.", "Каждого пациента спасаете, а то, что в собственной склянке, — на потом. ……Все врачи таковы? Или только вы?"), choices: [
    { t: L("俺だ。直す。", "Me. I'll fix it.", "Я. Исправлю."), next: "g_neglect2_fix", add: { d_trust: 1 } },
    { t: L("口を出すな。", "Stay out of it.", "Не лезь."), next: "g_neglect2_cold", add: { d_cold: 1 } },
  ] },
  g_neglect2_fix: { who: "voice", t: L("はい。……ちゃんと食べさせてあげて。あの子、プリンの話ばかりしてるから。", "good. ……feed it properly. it talks about pudding constantly.", "Хорошо. ……Кормите как следует. Он только о пудинге и говорит."), next: "hub" },
  g_neglect2_cold: { who: "voice", t: L("口はありません。声だけです。だから出せるのは声だけ。……出しましたよ。", "i don't have a mouth to keep out. just a voice. so i used it. ……there.", "Рта у меня нет. Только голос. Вот я его и подал. ……Всё."), next: "hub" },

  // ---- clock taps
  g_clock: { who: "voice", t: L("受付の時計、{clock_taps}回叩きましたね。叩いても動きません。私も長いこと試しました。", "you tapped the reception clock {clock_taps} times. it doesn't help. it never moves. i tried for a long time.", "Вы стучали по часам в регистратуре {clock_taps} раз. Не поможет. Они не идут. Я долго пробовал."), set: { d_g_clk: 1 }, next: "g_clock_2" },
  g_clock_2: { who: "emrys", emo: "crossed", t: L("電池が切れてるだけだ。", "It's just the battery.", "Просто батарейка села."), next: "g_clock_3" },
  g_clock_3: { who: "voice", t: L("電池。……ええ、そう思っていればいい。電池はいい言葉です。替えがきく感じがする。", "the battery. ……yes. think that. 'battery' is a nice word. it sounds replaceable.", "Батарейка. ……Да, думайте так. Хорошее слово. В нём слышится, что можно заменить."), next: "hub" },
  g_clock2: { who: "voice", t: L("{clock_taps}回。三十三を越えました。……やめてください。時計に失礼です。", "{clock_taps}. you went past thirty-three. ……please stop. it's rude to the clock.", "{clock_taps}. Вы перешли за тридцать три. ……Прошу, перестаньте. Это невежливо по отношению к часам."), set: { d_g_clk2: 1 }, next: "g_clock2_2" },
  g_clock2_2: { who: "voice", t: L("あの時計はね、止まっているんじゃないんです。待っているんです。誰かが準備できるのを。叩かれると、急かされている気がするでしょう。", "that clock isn't stopped. it's waiting. for someone to be ready. tapping it feels like being rushed.", "Те часы не стоят. Они ждут. Пока кто-нибудь будет готов. А когда стучат — будто торопят."), next: "g_clock2_3" },
  g_clock2_3: { who: "emrys", emo: "ponder", t: L("……誰が準備するんだ。", "……Ready for what. Who.", "……Готов к чему. Кто."), next: "g_clock2_4" },
  g_clock2_4: { who: "voice", t: L("三時三十三分ですよね。", "it's 3:33, isn't it.", "Ведь три тридцать три, не так ли."), next: "hub" },

  // ---- silence
  g_silence: { who: "voice", t: L("……全部、消しましたね。換気扇の音も、雨の音も。", "……you turned everything off. the vent hum. the rain.", "……Вы всё выключили. Гул вентиляции. Дождь."), set: { d_g_sil: 1 }, next: "g_silence_b" },
  g_silence_b: { who: "voice", t: L("おかげで心臓の音が聞こえます。七十二。……いや、七十四。いま緊張しましたね。", "now i can hear your heart. seventy-two. ……no. seventy-four. you just got nervous.", "Теперь слышно ваше сердце. Семьдесят два. ……Нет, семьдесят четыре. Вы заволновались."), next: "g_silence_c" },
  g_silence_c: { who: "emrys", emo: "wary", t: L("……聞くな。", "……Don't listen to that.", "……Не слушай."), next: "g_silence_d" },
  g_silence_d: { who: "voice", t: L("動いている音ですよ。ここでは珍しい。大事にしてください。", "it's the sound of something still going. that's rare here. take care of it.", "Это звук того, что ещё идёт. Здесь это редкость. Берегите."), next: "hub" },
  g_silence2: { who: "voice", t: L("また静か。いいですね。建物が音を立てるのを忘れているときが、好きです。", "quiet again. good. i like it when the building forgets to make noise.", "Снова тихо. Славно. Люблю, когда здание забывает шуметь."), set: { d_def: 4 }, next: "hub" },

  // ---- visit milestones
  g_v10: { who: "voice", t: L("{visits}回目。二桁です。何か焼きましょうか。焼けませんけど。手が、ふつうの意味では、ないので。", "visit {visits}. double digits. should i bake something. i can't bake. i don't have hands in the usual sense.", "Визит {visits}. Двузначное число. Испечь что-нибудь? Не умею. Рук у меня, в обычном смысле, нет."), set: { d_g_10: 1 }, next: "g_v10_2" },
  g_v10_2: { who: "emrys", emo: "normal", t: L("気持ちだけもらっておく。", "I'll take the thought.", "Ограничусь намерением."), next: "g_v10_3" },
  g_v10_3: { who: "voice", t: L("気持ちは焼けるんです。外はかりっと、中はちょっと生。", "the thought i can bake. crisp outside, a little raw inside.", "Намерение испечь могу. Снаружи хрустит, внутри сыровато."), next: "hub" },
  g_v25: { who: "voice", t: L("{visits}回。休憩室より、ここに来ているでしょう。人に噂されますよ。人はいませんけど。壁に噂されます。", "{visits}. you come here more often than the break room. people will talk. there are no people. the walls will talk.", "{visits}. Вы бываете здесь чаще, чем в ординаторской. Пойдут толки. Людей нет. Толковать будут стены."), set: { d_g_25: 1 }, next: "g_v25_2" },
  g_v25_2: { who: "voice", t: L("……あなたの来る時間は、毎回だいたい同じです。三時三十三分。当然ですね。", "……you always come at about the same time. 3:33. naturally.", "……Вы всегда приходите примерно в одно время. В три тридцать три. Естественно."), next: "g_v25_3" },
  g_v25_3: { who: "emrys", emo: "ponder", t: L("……他にやることがない時間なんだよ。", "……It's the hour with nothing else to do.", "……Это час, когда больше нечем заняться."), next: "g_v25_4" },
  g_v25_4: { who: "voice", t: L("それ、ずいぶん長い一時間ですね。", "that's a very long hour.", "Долгий же это час."), next: "hub" },

  // ---- minigame fails / S ranks
  g_fails: { who: "voice", t: L("{fails}回、失敗しましたね。通算で。それも数えています。三回目あたりから手が震える。コーヒーですか、疲れですか。", "you've failed {fails} times. in total. i count those too. your hands start shaking around the third. coffee or tiredness?", "Вы ошиблись {fails} раз. Всего. Это я тоже считаю. Руки начинают дрожать где-то с третьего. Кофе или усталость?"), set: { d_g_fails: 1 }, next: "g_fails_2" },
  g_fails_2: { who: "emrys", emo: "annoyed", t: L("両方。どっちでもない。そう。", "Both. Neither. Yes.", "Оба. Ни то ни другое. Да."), next: "g_fails_3" },
  g_fails_3: { who: "voice", t: L("失敗してもね、ここでは誰も死にませんよ。……もう、という意味で。", "nobody dies here when you fail, you know. ……anymore, i mean.", "Здесь никто не умирает, когда вы ошибаетесь. ……Уже, я имею в виду."), next: "hub" },
  g_srank: { who: "voice", t: L("また完璧でしたね。あなたは人をここに引き留めるのが、とても上手だ。……言い方が悪かった。それとも、正しかった。", "perfect again. you're very good at keeping people here. ……that came out wrong. or right.", "Опять безупречно. Вы прекрасно умеете удерживать людей здесь. ……Неудачно выразился. Или удачно."), set: { d_g_srank: 1 }, next: "g_srank_2" },
  g_srank_2: { who: "emrys", emo: "crossed", t: L("仕事だ。上手くて困ることはない。", "It's the job. Being good at it isn't a problem.", "Это работа. Хорошо её делать — не порок."), next: "g_srank_3" },
  g_srank_3: { who: "voice", t: L("問題なのは、上手すぎて、誰もあなたを引き留めないことです。", "the problem is you're so good that nobody ever keeps you.", "Беда в том, что вы так хороши, что никто не удерживает вас."), next: "hub" },

  // ---- anomalies
  g_anom: { who: "voice", t: L("いろいろ気づいていますね。{anomalies}個。建物は気づかれるのが嫌いです。私は好きですけど。", "you've been noticing things. {anomalies} of them. the building hates being noticed. i like it.", "Вы многое замечаете. {anomalies} вещей. Здание не любит, когда его замечают. А я люблю."), set: { d_g_anom: 1 }, next: "g_anom_2" },
  g_anom_2: { who: "voice", t: L("ひとつ教えてあげましょうか。廊下の窓、外の雨は、地面に落ちていません。", "shall i give you one more. the rain outside the corridor window never reaches the ground.", "Подарить вам ещё одну? Дождь за окном коридора не долетает до земли."), next: "g_anom_3" },
  g_anom_3: { who: "emrys", emo: "think", t: L("……あとで確認する。", "……I'll check later.", "……Проверю потом."), next: "g_anom_4" },
  g_anom_4: { who: "voice", t: L("あとで。いい言葉。ここにしかない言葉です。", "later. nice word. it only exists here.", "Потом. Хорошее слово. Оно бывает только здесь."), next: "hub" },

  // ---- real hours
  g_r3: { who: "voice", t: L("……本当に三時なんですね。そっちでも。本物の三時。", "……it really is three, where you are. the real three.", "……У вас и вправду три часа. Настоящие три."), set: { d_g_r3: 1 }, next: "g_r3_2" },
  g_r3_2: { who: "voice", t: L("わかります。寝るべき人の息の仕方をしているから。", "i can tell. you're breathing like someone who should be asleep.", "Я слышу. Вы дышите как тот, кому положено спать."), next: "g_r3_3" },
  g_r3_3: { who: "emrys", emo: "ponder", t: L("……誰に言ってる。", "……Who are you talking to.", "……С кем ты говоришь."), next: "g_r3_4" },
  g_r3_4: { who: "voice", t: L("あなたに。あなたの後ろにいる、もうひとりにも。三十三分になる前に、寝てくださいね。", "you. and the one behind you, too. go to sleep before it's thirty-three.", "С вами. И с тем, кто за вами. Ложитесь до тридцати трёх минут."), next: "hub" },
  g_late: { who: "voice", t: L("遅いですね。外の、ほうの遅さだ。{hour}時{minute}分。……こっちは、いつもどおりです。", "late. the outside kind of late. {hour}:{minute}. ……here it's the usual.", "Поздно. По-настоящему, по-наружному. {hour}:{minute}. ……А у нас — как всегда."), next: "hub" },
  g_day: { who: "voice", t: L("……どこかが明るい。あなたから、その匂いがします。おかしいな。三時三十三分のはずなのに。", "……it's bright somewhere. i can smell it on you. strange. it should be 3:33.", "……Где-то светло. От вас этим пахнет. Странно. Должно быть три тридцать три."), set: { d_g_day: 1 }, next: "g_day_2" },
  g_day_2: { who: "emrys", emo: "think", t: L("日の光の匂いなんてあるのか。", "Daylight has a smell?", "У дневного света есть запах?"), next: "g_day_3" },
  g_day_3: { who: "voice", t: L("あります。洗濯物と、遠い車と、誰かが朝ごはんを焦がした匂い。……覚えていないなら、それでいいです。", "yes. laundry. distant cars. someone burning breakfast. ……if you don't remember it, that's fine.", "Есть. Бельё на верёвке. Далёкие машины. Кто-то пережарил завтрак. ……Не помните — и ладно."), next: "hub" },
  g_day2: { who: "voice", t: L("また袖に昼の光がついていますよ。払っておきなさい。ここでは目立つ。", "daylight on your sleeves again. brush it off. it stands out in here.", "Опять на рукавах дневной свет. Стряхните. Здесь он бросается в глаза."), set: { d_def: 3 }, next: "hub" },

  // ---- pudding in pocket
  g_pud: { who: "voice", t: L("ポケットに、何か甘いものが入っていますね。歩き方でわかる。そっと運んでいる。小さな月でも持っているみたいに。", "there's something sweet in your pocket. i can tell by how you walk. carefully. like you're carrying a small moon.", "У вас в кармане что-то сладкое. Понятно по походке. Бережно. Словно несёте маленькую луну."), set: { d_g_pud: 1 }, next: "hub" },

  // ---- endings acknowledged
  g_e_dawn: { who: "voice", t: L("……戻ってきたんですね。朝のほうから。", "……you came back. from the morning side.", "……Вы вернулись. С утренней стороны."), set: { d_ack_dawn: 1 }, next: "g_e_dawn_2" },
  g_e_dawn_2: { who: "voice", t: L("どうでした。……いえ、言わないで。言ってください。いや、やっぱり。", "what was it like. ……no, don't tell me. tell me. no.", "Каково там? ……Нет, не говорите. Скажите. Нет, всё же не надо."), next: "g_e_dawn_3" },
  g_e_dawn_3: { who: "emrys", emo: "ponder", t: L("……まぶしかった気がする。覚えてない。", "……It was bright, I think. I don't remember.", "……Кажется, было светло. Не помню."), next: "g_e_dawn_4" },
  g_e_dawn_4: { who: "voice", t: L("それで正しい。朝は持ち帰れないものです。……おかえりなさい。また三時三十三分ですよ。", "that's correct. you can't bring morning back with you. ……welcome back. it's 3:33 again.", "Так и должно быть. Утро с собой не унести. ……С возвращением. Снова три тридцать три."), next: "hub" },
  g_e_shift: { who: "voice", t: L("あなたは、残ると決めた。覚えていますか。……私は覚えています。", "you decided to stay. do you remember. ……i do.", "Вы решили остаться. Помните? ……Я помню."), set: { d_ack_shift: 1 }, next: "g_e_shift_2" },
  g_e_shift_2: { who: "emrys", emo: "normal", t: L("夜勤だからな。", "It's the night shift.", "Ночная смена."), next: "g_e_shift_3" },
  g_e_shift_3: { who: "voice", t: L("ええ。ずっと夜勤。……でも、まだここに来るんですね。扉の前に。それなら、まだ全部は決まっていない。", "yes. night shift, always. ……but you still come here. to the door. so not everything's decided.", "Да. Вечная ночная смена. ……Но вы всё ещё приходите. К двери. Значит, не всё решено."), next: "hub" },
  g_e_forget: { who: "voice", t: L("……はじめまして。", "……nice to meet you.", "……Очень приятно."), set: { d_ack_forget: 1 }, next: "g_e_forget_2" },
  g_e_forget_2: { who: "voice", t: L("冗談です。たぶん。何かを返した気がするのに、手のひらがまだ温かい。あなたもですか。", "a joke. probably. i feel like i returned something, but my palm is still warm. you too?", "Шучу. Наверное. Будто что-то отдал, а ладонь всё ещё тёплая. У вас тоже?"), next: "g_e_forget_3" },
  g_e_forget_3: { who: "emrys", emo: "ponder", t: L("……この扉、前にも来たことがある気がする。", "……I feel like I've been to this door before.", "……Мне кажется, я уже бывал у этой двери."), next: "g_e_forget_4" },
  g_e_forget_4: { who: "voice", t: L("気のせいです。気のせいというのは、記憶の留守番電話みたいなものです。", "it's just a feeling. feelings like that are memory's answering machine.", "Это вам кажется. Такие «кажется» — автоответчик памяти."), next: "hub" },
  g_e_tsubu: { who: "voice", t: L("あの小さいの、元気ですか。……瓶の音がしない夜が、一度ありましたね。", "is the little one well. ……there was one night without the rattle of the bottle.", "Как малыш? ……Была одна ночь, когда склянка не гремела."), set: { d_ack_tsubu: 1 }, next: "g_e_tsubu_2" },
  g_e_tsubu_2: { who: "emrys", emo: "normal", t: L("今はうるさいくらいだ。", "It's loud enough now.", "Сейчас гремит вовсю."), next: "g_e_tsubu_3" },
  g_e_tsubu_3: { who: "voice", t: L("よかった。うるさいのは、いいことです。ここでは特に。", "good. loud is good. especially here.", "Хорошо. Шум — это хорошо. Особенно здесь."), next: "hub" },
  g_e_both: { who: "voice", t: L("……こっち側から、あなたの声を聞くのは変な感じです。", "……it's strange, hearing your voice from this side.", "……Странно слышать ваш голос с этой стороны."), set: { d_ack_both: 1 }, next: "g_e_both_2" },
  g_e_both_2: { who: "emrys", emo: "think", t: L("どっち側だ。", "Which side.", "С какой стороны."), next: "g_e_both_3" },
  g_e_both_3: { who: "voice", t: L("わからなくなりました。それが、たぶん正解だった。……さあ、今日も数えましょう。一、一、一。", "i can't tell anymore. that was probably the right answer. ……well. let's count. one, one, one.", "Я уже не различаю. Наверное, в этом и был ответ. ……Ну что ж, считаем. Раз, раз, раз."), next: "hub" },

  // ---- rotating defaults
  g_d0: { who: "voice", t: L("……右足から。いつもどおりですね。今日は四十歩。少し遠回りしましたか。", "……right foot first. as usual. forty steps today. did you take the long way.", "……С правой ноги. Как всегда. Сегодня сорок шагов. Шли кружным путём?"), set: { d_def: 1 }, next: "g_d0_2" },
  g_d0_2: { who: "emrys", emo: "normal", t: L("自販機に寄った。", "Stopped at the vending machine.", "Заходил к автомату."), next: "g_d0_3" },
  g_d0_3: { who: "voice", t: L("うらやましい。", "envious.", "Завидую."), next: "hub" },
  g_d1: { who: "voice", t: L("そこ、私のお気に入りの暗がりの上に立ってますよ。……もう少し左へ。はい。どうも。", "you're standing on my favorite patch of dark. ……a little to the left. there. thank you.", "Вы стоите на моём любимом клочке темноты. ……Чуть левее. Вот. Благодарю."), set: { d_def: 2 }, next: "g_d1_2" },
  g_d1_2: { who: "emrys", emo: "annoyed", t: L("暗がりに好みがあるのか。", "You have a favorite dark.", "У тебя есть любимая темнота."), next: "g_d1_3" },
  g_d1_3: { who: "voice", t: L("あります。そこはいちばん古い。あなたが来るずっと前からある。……ずっと、というほどでもないか。", "yes. that one is the oldest. it was there long before you. ……not that long, maybe.", "Есть. Та — самая старая. Она была задолго до вас. ……Хотя, может, не так уж задолго."), next: "hub" },
  g_d2: { who: "voice", t: L("いま何時ですか。", "what time is it.", "Который час?"), set: { d_def: 3 }, next: "g_d2_2" },
  g_d2_2: { who: "emrys", emo: "crossed", t: L("三時三十三分。毎回聞くな。", "Three thirty-three. Stop asking.", "Три тридцать три. Хватит спрашивать."), next: "g_d2_3" },
  g_d2_3: { who: "voice", t: L("聞きたいんです。同じ答えが返ってくるのが、安心する。……一音だけの歌みたいで。", "i like asking. i like the same answer. ……like a song with one note.", "Мне нравится спрашивать. Нравится один и тот же ответ. ……Как песня из одной ноты."), next: "hub" },
  g_d3: { who: "voice", t: L("息が、今日は浅いですね。十一回。扉の前に立ってから、まだ十一回しか吸ってない。", "your breathing's shallow today. eleven. you've only breathed eleven times since you got here.", "Дышите сегодня неглубоко. Одиннадцать. С тех пор как подошли, вдохнули всего одиннадцать раз."), set: { d_def: 4 }, next: "g_d3_2" },
  g_d3_2: { who: "emrys", emo: "normal", t: L("足りてる。", "It's enough.", "Хватает."), next: "g_d3_3" },
  g_d3_3: { who: "voice", t: L("……そうですね。ここでは、足りてしまうんですよね。", "……yes. here, it's always enough. that's the thing.", "……Да. Здесь всегда хватает. В том-то и дело."), next: "hub" },
  g_d4: { who: "voice", t: L("こんばんは。……こんばんは、で合ってますよね。こんにちは、の時間はもう来ないから。", "good evening. ……that's right, isn't it. good afternoon doesn't come around anymore.", "Добрый вечер. ……Ведь верно? «Добрый день» сюда больше не заходит."), set: { d_def: 0 }, next: "hub" },
  g_default: { who: "voice", t: L("……ああ。来ましたね。", "……oh. it's you.", "……А. Это вы."), set: { d_def: 0 }, next: "hub" },
});

// ------------------------------------------------------------------
// HUB
// ------------------------------------------------------------------
const C = (ja, en, ru, next, req, extra) => Object.assign({ t: L(ja, en, ru), next, req: req || "" }, extra || {});

N.hub = { who: "voice", t: L("……それで。", "……so.", "……Итак."), choices: [
  // identity
  C("……誰なんだ、あんた。", "……Who are you.", "……Кто ты такой.", "id1_a", "d_id==0"),
  C("名前を貸した、と言ってたな。誰に。", "You said you lent your name. To who.", "Ты сказал, что одолжил имя. Кому.", "id2_a", "d_id==1 && door_visits>=5"),
  C("じゃあ、俺は誰なんだ。", "So who am I, then.", "Тогда кто я.", "id3_a", "d_id==2 && door_visits>=9 && night>=4"),
  // time
  C("なんで毎回、時間を聞く。", "Why do you keep asking the time.", "Зачем ты всё время спрашиваешь время.", "time1_a", "d_time==0"),
  C("数えてるって言ったな。何に向かって数えてる。", "You count. Toward what.", "Ты считаешь. До чего.", "time2_a", "d_time==1 && door_visits>=3"),
  C("……もし時計が動いたら、どうなる。", "……If the clock moved. What happens.", "……Если часы пойдут. Что будет.", "time3_a", "d_time==2 && door_visits>=6 && night>=3"),
  // death
  C("人が死ぬのを見てきたような口ぶりだな。", "You talk like someone who's watched people die.", "Ты говоришь как тот, кто видел смерть.", "death1_a", "d_death==0 && door_visits>=2"),
  C("夜明けに退院した患者は、どこへ行く。", "The ones discharged at dawn. Where do they go.", "Те, кого выписывают на рассвете. Куда они уходят.", "death2_a", "d_death==1 && door_visits>=4"),
  C("……あんたは、死んでるのか。", "……Are you dead.", "……Ты мёртв.", "death3_a", "d_death==2 && door_visits>=7 && night>=4"),
  // loneliness
  C("その中、寂しくないのか。", "Doesn't it get lonely in there.", "Тебе там не одиноко.", "lone1_a", "d_lonely==0 && door_visits>=2"),
  C("……来てほしいのか。俺に。", "……Do you want me to keep coming.", "……Ты хочешь, чтобы я приходил.", "lone2_a", "d_lonely==1 && door_visits>=4"),
  C("俺の前は、誰がここに来てた。", "Who used to come here. Before me.", "Кто приходил сюда до меня.", "lone3_a", "d_lonely==2 && door_visits>=8"),
  // memory
  C("昔のこと、覚えてるか。", "Do you remember anything. From before.", "Ты помнишь что-нибудь. Из прежнего.", "mem1_a", "d_mem==0 && night>=2"),
  C("俺のこと、何を覚えてる。", "What do you remember about me.", "Что ты помнишь обо мне.", "mem2_a", "d_mem==1 && door_visits>=4"),
  C("鍵を返したら、何が残る。", "If I gave back the key. What's left.", "Если я верну ключ. Что останется.", "mem3_a", "d_mem==2 && door_visits>=7 && night>=3"),
  // fear
  C("怖いものはあるのか。", "Are you afraid of anything.", "Ты чего-нибудь боишься.", "fear1_a", "d_fear==0 && door_visits>=3"),
  C("なんで出てこない。", "Why don't you come out.", "Почему ты не выходишь.", "fear2_a", "d_fear==1 && door_visits>=6"),
  // meaning
  C("終わらない夜勤に、意味はあるのか。", "What's the point. Of a shift that doesn't end.", "Какой смысл. В смене, которая не кончается.", "mean1_a", "d_mean==0 && night>=3"),
  C("あんたの夜勤には、意味があったのか。", "Did your shift mean anything.", "Твоя смена что-нибудь значила.", "mean2_a", "d_mean==1 && door_visits>=6"),
  // disappearing
  C("物は、ただ消えると思うか。", "Do you think things just disappear.", "Думаешь, вещи просто исчезают.", "dis1_a", "d_disap==0 && night>=3 && d_mem>=1"),
  C("あんた、消えかけてるのか。", "Are you disappearing.", "Ты исчезаешь.", "dis2_a", "d_disap==1 && door_visits>=5"),
  C("あんたが消えたら、俺は気づくか。", "If you disappeared. Would I notice.", "Если ты исчезнешь. Я замечу.", "dis3_a", "d_disap==2 && door_visits>=8 && night>=4"),
  // attachment
  C("人に情が移るほうか。", "Do you get attached. To people.", "Ты привязываешься. К людям.", "att1_a", "d_attach==0 && d_lonely>=1 || d_attach==0 && tsubu_bond>=3"),
  C("しがみつくのは、悪いことか。", "Is it bad. Holding on.", "Это плохо. Держаться.", "att2_a", "d_attach==1 && door_visits>=6"),
  // inevitability
  C("全部、いつかは終わるのか。", "Does everything end.", "Всё кончается.", "inev1_a", "d_inev==0 && night>=4"),
  C("避けられないなら、なんで抗う。", "If it can't be avoided, why fight it.", "Если неизбежно, зачем бороться.", "inev2_a", "d_inev==1 && door_visits>=7"),
  // border
  C("この場所は、どこで終わる。", "Where does this place end.", "Где кончается это место.", "bor1_a", "d_border==0 && night>=4 && d_death>=2"),
  C("あんたは、どっち側にいる。", "Which side are you on.", "На какой ты стороне.", "bor2_a", "d_border==1 && door_visits>=8"),
  C("越えた人は、どうなる。", "What happens to someone who crosses.", "Что бывает с тем, кто переходит.", "bor3_a", "d_border==2 && door_visits>=10 && night>=5"),
  // light topics
  C("自販機の話でもするか。", "Want to talk about the vending machine.", "Поговорим про автомат.", "vend_a", "d_vend==0"),
  C("また自販機の話か。", "The vending machine again.", "Опять про автомат.", "vend2_a", "d_vend==1 && door_visits>=3"),
  C("自販機、止まってたぞ。", "The vending machine stopped humming.", "Автомат перестал гудеть.", "vend3_a", "d_vend==2 && door_visits>=6"),
  C("プリンの味？", "What pudding tastes like?", "Каков пудинг на вкус?", "pud_a", "d_pud==0"),
  C("プリン、持ってきた。", "I brought pudding.", "Я принёс пудинг.", "pud2_a", "has_pudding && d_pud>=1", { once: true }),
  C("ツブのことだが。", "About Tsubu.", "Насчёт Цубу.", "tsu1_a", "d_tsubu==0 && tsubu_bond>=2"),
  C("瓶のこと、何か知ってるのか。", "You know something about the bottle.", "Ты что-то знаешь про склянку.", "tsu2_a", "d_tsubu==1 && tsubu_bond>=5"),
  C("……ツブを、どうすればいい。", "……What do I do about Tsubu.", "……Что мне делать с Цубу.", "tsu3_a", "d_tsubu==2 && tsubu_bond>=7 && door_visits>=6"),
  C("患者の話を聞くか。", "Want to hear about the patients.", "Рассказать о пациентах.", "pat_a", "night>=2"),
  C("受付の時計のことだが。", "About the reception clock.", "Насчёт часов в регистратуре.", "clk_a", "d_clock==0"),
  C("あんた、眠るのか。", "Do you sleep.", "Ты спишь.", "slp_a", "d_sleep==0"),
  C("今日は火曜日だ。……たぶん。", "It's Tuesday. ……Probably.", "Сегодня вторник. ……Наверное.", "tue_a", "d_tue==0 && door_visits>=3", { once: true }),
  C("……わかった。いつものやつ、やるか。", "……Fine. Your game.", "……Ладно. Твоя игра.", "game_hub", ""),
  // hidden ending routes
  C("……窓が、少し明るい気がする。", "……The window looks a little lighter.", "……Окно будто чуть посветлело.", "dawn_a", "room4_seen && rooftop_seen && d_truth>=8 && d_border>=3"),
  C("シフトは、最後まで務める。", "I'll finish the shift.", "Я доработаю смену.", "shift_a", "d_cold>=6 && night>=3 && d_inev>=1"),
  C("シフトは、最後まで務める。", "I'll finish the shift.", "Я доработаю смену.", "shift_a", "d_refuse>=6 && d_cold<6 && night>=3 && d_inev>=1"),
  C("鍵を、返しに来た。", "I came to return the key.", "Я пришёл вернуть ключ.", "fgt_a", "d_key==1 && records_seen && d_mem>=3 && d_disap>=2"),
  C("……ツブが、何か言いたいらしい。", "……Tsubu wants to say something.", "……Цубу хочет что-то сказать.", "tse_a", "tsubu_bond>=8 && d_tsubu>=3"),
  C("扉を、開けてくれ。", "Open the door.", "Открой дверь.", "both_a", "d_finals>=11 && d_trust>=6 && door_visits>=12"),
] };

// ------------------------------------------------------------------
// LIGHT TOPICS
// ------------------------------------------------------------------
Object.assign(N, {
  // vending 1
  vend_a: { who: "voice", t: L("廊下の機械。あれは何を売っているんですか。夜中にずっと、考え事をしているみたいな音を立てている。", "the machine in the corridor. what does it sell. it hums all night like it's thinking something over.", "Тот аппарат в коридоре. Что он продаёт? Всю ночь гудит, будто обдумывает что-то."), next: "vend_b" },
  vend_b: { who: "emrys", emo: "normal", t: L("コーヒー。まずいコーヒー。あとはコーンスープの缶。", "Coffee. Bad coffee. And canned corn soup.", "Кофе. Плохой кофе. И кукурузный суп в банке."), next: "vend_c" },
  vend_c: { who: "voice", t: L("コーンスープ。缶に。……誰が考えたんですか。天才ですか、それとも寂しい人ですか。", "corn soup. in a can. ……who thought of that. a genius or a lonely person.", "Кукурузный суп. В банке. ……Кто это придумал? Гений или одинокий человек?"), next: "vend_d" },
  vend_d: { who: "emrys", emo: "think", t: L("両方だろ。", "Both, probably.", "Наверное, и то и другое."), next: "vend_e" },
  vend_e: { who: "voice", t: L("ボタンを押すと、なんて鳴りますか。", "when you press the button. what sound does it make.", "А когда нажимаешь кнопку — какой звук?"), choices: [
    { t: L("「ピッ」。", "'Pip.'", "«Пик»."), next: "vend_pi" },
    { t: L("「ガコン」。缶が落ちる。", "'Clunk.' The can drops.", "«Бряк». Банка падает."), next: "vend_clunk", add: { d_trust: 1 } },
    { t: L("覚えてない。いつも眠いから。", "I don't remember. I'm always half-asleep.", "Не помню. Я всегда полусонный."), next: "vend_sleep", add: { d_truth: 1 } },
  ] },
  vend_pi: { who: "voice", t: L("ピッ。……可愛い。それだけ？", "pip. ……cute. that's all?", "Пик. ……Мило. И всё?"), next: "vend_clunk" },
  vend_clunk: { who: "voice", t: L("ガコン。いい音だ。何かが決まって、落ちてくる音。……あれ、缶の底が温かいんでしょう。知ってます。知っている気がします。", "clunk. good sound. the sound of something decided, falling into place. ……the bottom of the can is warm, isn't it. i know that. i think i know that.", "Бряк. Хороший звук. Звук решённого, которое падает на место. ……Дно банки тёплое, да? Я знаю. Мне кажется, знаю."), next: "vend_end" },
  vend_sleep: { who: "voice", t: L("眠いのに、ボタンだけは押す。人間の手は、頭より先に生き延び方を覚えるんですね。", "half-asleep, and still you press the button. hands learn how to survive before heads do.", "В полусне, а кнопку всё равно жмёте. Руки учатся выживать прежде головы."), next: "vend_end" },
  vend_end: { who: "voice", t: L("今度、ガコンって言ってください。扉の前で。それだけでいいです。", "next time, say 'clunk' for me. by the door. that's all i want.", "В другой раз скажите мне «бряк». У двери. Больше ничего не надо."), set: { d_vend: 1 }, next: "hub" },
  // vending 2
  vend2_a: { who: "emrys", emo: "crossed", t: L("……ガコン。", "……Clunk.", "……Бряк."), next: "vend2_b" },
  vend2_b: { who: "voice", t: L("……ありがとう。覚えていてくれた。", "……thank you. you remembered.", "……Спасибо. Вы запомнили."), next: "vend2_c" },
  vend2_c: { who: "voice", t: L("あなたは今、{coins}枚持っています。小銭の音でわかる。私に何か買ってくれますか。飲めませんけど。落ちる音が聞きたいんです。", "you have {coins} coins on you. i can hear them. will you buy me something. i can't drink it. i just want to hear it fall.", "При вас {coins} монет. Я слышу. Купите мне что-нибудь? Пить не могу. Хочу услышать, как упадёт."), choices: [
    { t: L("コーンスープを買ってくる。", "I'll get the corn soup.", "Возьму кукурузный суп.", ), next: "vend2_buy", add: { d_trust: 1 } },
    { t: L("金の無駄だ。", "Waste of money.", "Пустая трата денег."), next: "vend2_no", add: { d_cold: 1 } },
  ] },
  vend2_buy: { who: "narr", t: L("遠くで、ガコン、と音がした。エムリスは温かい缶を扉の隙間の前に置く。", "Far down the corridor: clunk. Emrys sets the warm can by the gap under the door.", "Вдали, в коридоре: бряк. Эмрис ставит тёплую банку у щели под дверью."), next: "vend2_buy2" },
  vend2_buy2: { who: "voice", t: L("……湯気が入ってくる。とうもろこしの匂い。夏の匂いですね。夏って、まだありますか。", "……the steam is coming in. corn. that's a summer smell. is there still summer.", "……Пар заходит. Кукуруза. Это летний запах. Лето ещё бывает?"), next: "vend2_buy3" },
  vend2_buy3: { who: "emrys", emo: "ponder", t: L("……あるよ。どこかには。", "……Somewhere. Yes.", "……Где-то. Да."), set: { d_vend: 2 }, next: "hub" },
  vend2_no: { who: "voice", t: L("無駄。そうですね。ここでは、お金を貯めても使い道がない。……だから無駄遣いが一番の贅沢なのに。", "waste. yes. there's nothing to save money for here. ……which makes wasting it the only luxury.", "Трата. Да. Копить здесь не на что. ……Потому-то транжирство и есть единственная роскошь."), set: { d_vend: 2 }, next: "hub" },
  // vending 3
  vend3_a: { who: "voice", t: L("気づきましたか。三時三十三分に、一回だけ、唸るのをやめるんです。毎晩。同じところで。", "you noticed. at 3:33 it stops humming, just once. every night. at the same moment.", "Заметили. В три тридцать три он один раз замолкает. Каждую ночь. В тот же миг."), next: "vend3_b" },
  vend3_b: { who: "emrys", emo: "think", t: L("毎晩三時三十三分なら、ずっと止まってることになる。", "If it's always 3:33, it'd always be stopped.", "Если всегда три тридцать три, он всегда стоит."), next: "vend3_c" },
  vend3_c: { who: "voice", t: L("……算数が得意ですね、先生。そう。止まっていて、それでも唸っている。私たちと同じです。", "……good at arithmetic, doctor. yes. stopped, and humming anyway. like us.", "……Вы сильны в арифметике, доктор. Да. Стоит — и всё же гудит. Как мы."), add: { d_truth: 1 }, set: { d_vend: 3 }, next: "hub" },

  // pudding
  pud_a: { who: "voice", t: L("プリンって、どんな味ですか。あの小さいのが、一日に三回は言うので。", "what does pudding taste like. the little one says the word three times a day.", "Каков на вкус пудинг? Малыш поминает его раза три на дню."), next: "pud_b" },
  pud_b: { who: "emrys", emo: "think", t: L("……甘い。それから、底のほうが苦い。カラメルだ。", "……Sweet. Then bitter at the bottom. Caramel.", "……Сладкий. А на дне горчит. Карамель."), next: "pud_c" },
  pud_c: { who: "voice", t: L("底が苦い。たいていのものと同じですね。だから人は上から食べるのか。", "bitter at the bottom. like most things. so that's why people eat from the top.", "На дне горчит. Как почти всё. Вот почему едят сверху."), choices: [
    { t: L("底から食べるやつもいる。", "Some people eat from the bottom.", "Некоторые едят снизу."), next: "pud_bottom", add: { d_truth: 1 } },
    { t: L("混ぜればいい。", "You mix it.", "Можно перемешать."), next: "pud_mix", add: { d_trust: 1 } },
  ] },
  pud_bottom: { who: "voice", t: L("先に苦いのを片づけておく人。……あなたですね、それ。顔が見えなくてもわかる。", "people who get the bitter part over with first. ……that's you. i can tell without seeing your face.", "Те, кто сперва разделывается с горьким. ……Это вы. Видно и без лица."), set: { d_pud: 1 }, next: "hub" },
  pud_mix: { who: "voice", t: L("混ぜる。……なんて乱暴で、優しい解決。私には思いつかなかった。", "mix it. ……what a rough, kind solution. it never occurred to me.", "Перемешать. ……Какое грубое и доброе решение. Мне и в голову не приходило."), set: { d_pud: 1 }, next: "hub" },
  pud2_a: { who: "narr", t: L("エムリスはプリンのカップを、扉の隙間の前にそっと置いた。", "Emrys sets the pudding cup down gently by the gap beneath the door.", "Эмрис бережно ставит стаканчик пудинга у щели под дверью."), next: "pud2_b" },
  pud2_b: { who: "voice", t: L("……匂いがします。卵と、焦がした砂糖。……昔、蓋だけ置いていってくれた人がいました。中身はその人が食べて。", "……i can smell it. egg. burnt sugar. ……someone used to leave just the lid. they'd eat the rest themselves.", "……Чую. Яйцо, жжёный сахар. ……Когда-то мне оставляли только крышечку. Остальное съедали сами."), next: "pud2_c" },
  pud2_c: { who: "voice", t: L("持って帰ってください。あの小さいのにあげて。……いえ、あと一分だけ置いておいて。一分。数えますから。", "take it back. give it to the little one. ……no. leave it one more minute. one. i'll count.", "Заберите. Отдайте малышу. ……Нет. Оставьте ещё на минуту. Одну. Я посчитаю."), next: "pud2_d" },
  pud2_d: { who: "narr", t: L("扉の向こうで、六十まで数える小さな声がする。五十九のあとに、少し間があった。", "Behind the door, a small voice counts to sixty. There is a pause after fifty-nine.", "За дверью тихий голос считает до шестидесяти. После пятидесяти девяти — пауза."), add: { d_trust: 1 }, set: { d_pud: 2 }, next: "hub" },

  // clock
  clk_a: { who: "voice", t: L("あの時計、あなたは{clock_taps}回叩きました。", "you've tapped that clock {clock_taps} times.", "Вы стучали по тем часам {clock_taps} раз."), next: "clk_b" },
  clk_b: { who: "voice", t: L("ゼロなら、我慢強い人。少しなら、普通の人。たくさんなら……まだ間に合うと思っている人です。", "zero means patient. a few means normal. a lot means — you still think you can make it in time.", "Ноль — терпеливый. Немного — обычный. Много — тот, кто ещё надеется успеть."), next: "clk_c" },
  clk_c: { who: "emrys", emo: "annoyed", t: L("間に合うって、何に。", "Make it in time for what.", "Успеть к чему."), next: "clk_d" },
  clk_d: { who: "voice", t: L("八時の引き継ぎに。……あれ、私、引き継ぎの話なんかしましたっけ。", "the eight o'clock handover. ……wait. did i ever mention a handover to you.", "К пересменке в восемь. ……Постойте. Я разве говорил вам о пересменке?"), set: { d_clock: 1 }, next: "hub" },

  // sleep
  slp_a: { who: "voice", t: L("眠りません。閉まるだけです。お店みたいに。シャッターを下ろして、中で電気を消して、でも中にはいる。", "i don't sleep. i close. like a shop. shutter down, lights off, but still inside.", "Не сплю. Закрываюсь. Как лавка. Ставни опущены, свет погашен, а сам внутри."), next: "slp_b" },
  slp_b: { who: "voice", t: L("あなたは？", "you?", "А вы?"), choices: [
    { t: L("ゆっくりまばたきする。それが睡眠だ。", "I blink slowly. That's my sleep.", "Медленно моргаю. Это и есть сон."), next: "slp_blink", add: { d_trust: 1 } },
    { t: L("……最後に寝たのがいつか、思い出せない。", "……I can't remember the last time I slept.", "……Не помню, когда в последний раз спал."), next: "slp_true", add: { d_truth: 1 } },
    { t: L("勤務中だ。哲学は八時以降。", "I'm on shift. Philosophy is after eight.", "Я на смене. Философия — после восьми."), next: "slp_shift", add: { d_refuse: 1 } },
  ] },
  slp_blink: { who: "voice", t: L("さっきのまばたき、〇・八秒でした。おやすみなさい。おはようございます。", "that last blink was point eight seconds. good night. good morning.", "Последнее моргание — ноль целых восемь десятых секунды. Спокойной ночи. Доброе утро."), set: { d_sleep: 1 }, next: "hub" },
  slp_true: { who: "voice", t: L("……最後に横になったのは、四番のベッドだったかもしれませんね。冗談です。冗談に聞こえましたか。", "……maybe the last time you lay down was in bed four. a joke. did it sound like one.", "……Может, в последний раз вы ложились на четвёртую койку. Шучу. Похоже на шутку?"), set: { d_sleep: 1 }, next: "hub" },
  slp_shift: { who: "voice", t: L("八時以降。……楽しみにしています。ずっと。", "after eight. ……i'll look forward to it. for a long time.", "После восьми. ……Буду ждать. Долго."), set: { d_sleep: 1 }, next: "hub" },

  // tuesday
  tue_a: { who: "voice", t: L("……火曜日。もう一回言ってください。", "……tuesday. say it again.", "……Вторник. Скажите ещё раз."), next: "tue_b" },
  tue_b: { who: "emrys", emo: "crossed", t: L("火曜日。", "Tuesday.", "Вторник."), next: "tue_c" },
  tue_c: { who: "voice", t: L("なんて言葉だ。引っかかる扉みたいな音がする。……どの火曜日ですか。", "what a word. it sounds like a door that sticks. ……which tuesday.", "Что за слово. Звучит как дверь, которая заедает. ……Который вторник?"), choices: [
    { t: L("……ある火曜日だ。", "……A Tuesday.", "……Какой-то вторник."), next: "tue_d", add: { d_truth: 1 } },
    { t: L("今週の。", "This week's.", "На этой неделе."), next: "tue_e", add: { d_refuse: 1 } },
  ] },
  tue_d: { who: "voice", t: L("そう思いました。ここでは、全部「ある火曜日」なんです。", "that's what i thought. here everything happens on 'a tuesday'.", "Так я и думал. Здесь всё случается в «какой-то вторник»."), set: { d_tue: 1 }, next: "hub" },
  tue_e: { who: "voice", t: L("今週。週、というものがまだあるなら、教えてください。七つ数えるのは得意です。", "this week. if weeks still exist, tell me. i'm good at counting to seven.", "На этой неделе. Если недели ещё бывают, дайте знать. До семи считать я мастер."), set: { d_tue: 1 }, next: "hub" },

  // patients
  pat_a: { who: "voice", t: L("患者さんたちの話。……聞かせてください。私は、ここから足音しか知らないので。", "the patients. ……tell me. i only know them by their footsteps.", "О пациентах. ……Расскажите. Я знаю их только по шагам."), choices: [
    { t: L("スリッパを置いていった人がいた。", "Someone left their slippers behind.", "Кто-то оставил тапочки.", ), next: "pat_oda", req: "oda_done" },
    { t: L("若いのが一人、うるさくてな。", "There's a young one. Loud.", "Есть один молодой. Шумный."), next: "pat_kai", req: "night>=3" },
    { t: L("みんな、怖がってる。最初は。", "They're all scared. At first.", "Все боятся. Поначалу."), next: "pat_scared" },
  ] },
  pat_oda: { who: "voice", t: L("窓のほうに向けて、揃えてあったでしょう。……裸足で病院を出る人はいません。行く先が暖かい場合を除いて。", "lined up, pointing at the window, weren't they. ……nobody leaves a hospital barefoot. unless where they're going is warm.", "Ровно поставлены, носками к окну, да? ……Босиком из больницы не уходят. Разве что туда, где тепло."), add: { d_truth: 1 }, next: "hub" },
  pat_kai: { who: "voice", t: L("走る足音。廊下で二回滑った。若い人は、ここでも走るんですね。急ぐ必要なんてないのに。", "running steps. slipped twice in the corridor. young people run even here. as if there were a hurry.", "Бегущие шаги. Дважды поскользнулся в коридоре. Молодые и здесь бегают. Будто есть куда спешить."), next: "pat_kai2" },
  pat_kai2: { who: "emrys", emo: "normal", t: L("急ぐ理由がある奴もいる。", "Some of them have a reason to hurry.", "У некоторых есть причина спешить."), next: "pat_kai3" },
  pat_kai3: { who: "voice", t: L("……ええ。帰る場所がまだある人は、走る。", "……yes. the ones who still have somewhere to go back to. they run.", "……Да. Те, кому ещё есть куда вернуться, — бегут."), next: "hub" },
  pat_scared: { who: "voice", t: L("最初は。それから、あなたが来る。椅子を引く音がして、何も言わずに座る。あれで、だいたいの人は怖くなくなる。", "at first. then you come in. the sound of a chair being pulled up. you sit and don't say anything. that's enough for most of them.", "Поначалу. Потом входите вы. Скрип придвигаемого стула. Садитесь и молчите. Большинству этого хватает."), next: "pat_scared2" },
  pat_scared2: { who: "emrys", emo: "ponder", t: L("……座ってるだけだ。", "……I just sit there.", "……Я просто сижу."), next: "pat_scared3" },
  pat_scared3: { who: "voice", t: L("「だけ」が好きですね、あなたは。", "you love the word 'just'.", "Любите вы это слово — «просто»."), next: "hub" },
});

// ------------------------------------------------------------------
// TSUBU (light, 3 parts)
// ------------------------------------------------------------------
Object.assign(N, {
  tsu1_a: { who: "voice", t: L("瓶の中の、白い豆みたいなの。あれは何ですか。", "the white bean thing in the bottle. what is it.", "Та белая фасолинка в склянке. Что это?"), next: "tsu1_b" },
  tsu1_b: { who: "emrys", emo: "normal", t: L("ツブ。……同僚だ。", "Tsubu. ……A coworker.", "Цубу. ……Коллега."), next: "tsu1_c" },
  tsu1_c: { who: "voice", t: L("自分のことを名前で呼びますね。「ツブはおなかがすいた」。王様か、おもちゃのどちらかだ。", "it calls itself by its own name. 'tsubu is hungry.' that's either royalty or a toy.", "Говорит о себе по имени. «Цубу голоден». Так говорят либо короли, либо игрушки."), next: "tsu1_d" },
  tsu1_d: { who: "emrys", emo: "annoyed", t: L("本人の前で言うなよ。", "Don't say that in front of it.", "При нём так не говори."), next: "tsu1_e" },
  tsu1_e: { who: "voice", t: L("言いません。……あの子、あなたが食べさせた回数をちゃんと覚えています。私と同じで、数えるのが好きなんです。", "i won't. ……it remembers how many times you've fed it. it keeps count. like me. it likes counting.", "Не скажу. ……Он помнит, сколько раз вы его кормили. Ведёт счёт. Как я. Любит считать."), next: "tsu1_f" },
  tsu1_f: { who: "voice", req: "tsubu_sick_neglect>=1", alt: "tsu1_g", t: L("倒れた回数も、覚えていますよ。あの子は言わないけど。", "it remembers the times it got sick, too. it won't say so.", "И сколько раз хворал — тоже помнит. Только не скажет."), next: "tsu1_g" },
  tsu1_g: { who: "voice", t: L("大事にしてください。瓶の中にいるものは、外のことを全部、蓋ごしに聞いているんです。", "take care of it. things in bottles hear everything outside through the lid.", "Берегите его. Те, кто в склянке, слышат всё снаружи сквозь крышку."), choices: [
    { t: L("わかってる。", "I know.", "Знаю."), next: "tsu1_end", add: { d_trust: 1 } },
    { t: L("……あんたも、似たようなもんか。", "……You're the same, aren't you. Behind a lid.", "……Ты ведь такой же. За крышкой."), next: "tsu1_same", add: { d_truth: 1 } },
  ] },
  tsu1_same: { who: "voice", t: L("扉は大きな蓋です。……そうかもしれません。私たち、同じ棚に並んでいるのかも。", "a door is a big lid. ……maybe. maybe we're on the same shelf.", "Дверь — большая крышка. ……Может быть. Может, мы стоим на одной полке."), next: "tsu1_end" },
  tsu1_end: { who: "narr", t: L("遠くで、瓶がからんと鳴った。", "Somewhere far off, a bottle rattles.", "Где-то вдали звякнула склянка."), set: { d_tsubu: 1 }, next: "hub" },

  tsu2_a: { who: "voice", t: L("……ああいう瓶を、窓辺で見たことがあります。", "……i've seen a bottle like that. on a windowsill.", "……Я видел такую склянку. На подоконнике."), next: "tsu2_b" },
  tsu2_b: { who: "voice", t: L("子どもが……いえ、若い男の人が、緊張すると振っていた。からから鳴らして。返事はしなかった。おもちゃだったから。", "a child — no. a young man. he'd shake it when he was nervous. rattle, rattle. it never answered. it was a toy.", "Ребёнок… нет. Молодой человек. Тряс её, когда волновался. Дзынь-дзынь. Она не отвечала. Это была игрушка."), next: "tsu2_c" },
  tsu2_c: { who: "voice", t: L("あなたのは、返事をする。そこが違います。", "yours answers. that's the difference.", "Ваша отвечает. Вот и разница."), next: "tsu2_d" },
  tsu2_d: { who: "emrys", emo: "ponder", t: L("…………。", "…………", "…………"), choices: [
    { t: L("返事をするなら、それでいい。", "If it answers, that's enough.", "Раз отвечает — этого довольно."), next: "tsu2_ok", add: { d_trust: 1 } },
    { t: L("その若い男、どうなった。", "What happened to the young man.", "Что стало с тем молодым человеком."), next: "tsu2_man", add: { d_truth: 1 } },
    { t: L("ツブはおもちゃじゃない。", "Tsubu isn't a toy.", "Цубу не игрушка."), next: "tsu2_no" },
  ] },
  tsu2_ok: { who: "voice", t: L("ええ。返事をするなら、それはもう本物です。本物になるのに、理由はいりません。", "yes. if it answers, it's real. you don't need a reason to become real.", "Да. Раз отвечает — значит, настоящая. Чтобы стать настоящим, причины не нужно."), next: "tsu2_end" },
  tsu2_man: { who: "voice", t: L("病院で働くようになった。瓶はポケットに入れていた。白衣の、胸のポケット。ペンと一緒に。……それ以上は、まだ。", "he started working at a hospital. kept the bottle in his pocket. the chest pocket of his coat. with the pens. ……that's all. for now.", "Стал работать в больнице. Склянку носил в кармане. В нагрудном кармане халата. С ручками. ……Пока всё."), next: "tsu2_end" },
  tsu2_no: { who: "voice", t: L("そうです。おもちゃじゃない。……今は。そう言えるあなたで、よかった。", "no. it isn't. ……not now. i'm glad you're the one who says so.", "Нет. Не игрушка. ……Теперь. Хорошо, что это говорите вы."), add: { d_trust: 1 }, next: "tsu2_end" },
  tsu2_end: { who: "voice", t: L("今日は蓋の音がよく聞こえます。あの子、あなたの声を探してる。", "i can hear the lid clearly tonight. it's listening for your voice.", "Сегодня крышку хорошо слышно. Он ищет ваш голос."), set: { d_tsubu: 2 }, next: "hub" },

  tsu3_a: { who: "voice", t: L("あなたが行くとき。……もし行くなら。あの子はどうなりますか。", "when you go. ……if you go. what happens to the little one.", "Когда вы уйдёте. ……Если уйдёте. Что станет с малышом?"), next: "tsu3_b" },
  tsu3_b: { who: "emrys", emo: "wary", t: L("……どこへ行くって。", "……Go where.", "……Уйду куда."), next: "tsu3_c" },
  tsu3_c: { who: "voice", t: L("どこへでも。朝でも、夜の奥でも。瓶は、持ち主がいなくなると、ただの瓶に戻るんです。", "anywhere. morning. deeper into the night. a bottle goes back to being just a bottle when its owner is gone.", "Куда угодно. В утро. Вглубь ночи. Склянка, оставшись без хозяина, снова становится просто склянкой."), choices: [
    { t: L("連れていく。どこへでも。", "It comes with me. Wherever.", "Возьму с собой. Куда угодно."), next: "tsu3_take", set: { d_tsubu_choice: 1 }, add: { d_trust: 1 } },
    { t: L("残る。誰かが食べさせてくれるように頼む。", "It stays. I'll make sure someone feeds it.", "Останется. Попрошу, чтобы кормили."), next: "tsu3_stay", set: { d_tsubu_choice: 2 } },
    { t: L("……わからない。", "……I don't know.", "……Не знаю."), next: "tsu3_idk", set: { d_tsubu_choice: 3 }, add: { d_truth: 1 } },
  ] },
  tsu3_take: { who: "voice", t: L("どこへでも。……瓶ごと？　ポケットに？　ペンと一緒に？　……そうですか。昔と同じだ。", "wherever. ……bottle and all? in your pocket? with the pens? ……i see. same as before.", "Куда угодно. ……Вместе со склянкой? В кармане? С ручками? ……Вот как. Как прежде."), next: "tsu3_end" },
  tsu3_stay: { who: "voice", t: L("誰か。ここには、あなたしかいないのに。……でも、あの子なら自分で騒いで、誰かを呼ぶかもしれませんね。", "someone. there's only you here. ……but it might just shout until somebody comes.", "Кто-нибудь. Здесь ведь только вы. ……Впрочем, он, пожалуй, накричит, пока кто-нибудь не придёт."), next: "tsu3_end" },
  tsu3_idk: { who: "voice", t: L("わからない、が一番誠実な答えです。あの子にも、そう言ってあげてください。あの子は嘘がわかるから。", "'i don't know' is the most honest answer. tell it that, too. it can tell when you lie.", "«Не знаю» — самый честный ответ. Так ему и скажите. Он чует ложь."), next: "tsu3_end" },
  tsu3_end: { who: "voice", req: "tsubu_bond>=8", alt: "tsu3_end_b", t: L("……あの子、もうほとんどあなたの一部ですね。瓶が、あなたの脈で揺れている。", "……it's almost part of you now. the bottle rocks with your pulse.", "……Он теперь почти часть вас. Склянка покачивается в такт вашему пульсу."), set: { d_tsubu: 3 }, next: "hub" },
  tsu3_end_b: { who: "voice", t: L("もう少し、一緒にいてあげて。あの子が、あなたの脈を覚えるまで。", "stay with it a little longer. until it learns your pulse.", "Побудьте с ним ещё. Пока он не выучит ваш пульс."), set: { d_tsubu: 3 }, next: "hub" },
});

// ------------------------------------------------------------------
// THE GAME (rotates d_game 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  game_hub: { who: "voice", req: "d_game==0", alt: "game_hub1", t: L("数字当てです。一から五まで。私が考えている数字を当ててください。", "guess the number. one to five. guess the one i'm thinking of.", "Угадайте число. От одного до пяти. То, что я загадал."), choices: [
    { t: L("一。", "One.", "Один."), next: "gn_wrong" },
    { t: L("二。", "Two.", "Два."), next: "gn_wrong" },
    { t: L("三。", "Three.", "Три."), next: "gn_right" },
    { t: L("四。", "Four.", "Четыре."), next: "gn_four" },
    { t: L("五。", "Five.", "Пять."), next: "gn_wrong" },
  ] },
  gn_wrong: { who: "voice", t: L("はずれ。三です。いつも三です。三時三十三分の住人ですから、筋は通しています。", "wrong. three. it's always three. i live at 3:33. i'm consistent.", "Мимо. Три. Всегда три. Я живу в три тридцать три. Я последователен."), set: { d_game: 1 }, next: "hub" },
  gn_right: { who: "voice", t: L("……当たり。つまらない。当てられるのは嫌いです。次は四にします。嘘です。三です。", "……correct. boring. i hate being guessed. next time it'll be four. lie. three.", "……Верно. Скучно. Не люблю, когда угадывают. В следующий раз будет четыре. Ложь. Три."), add: { d_gwin: 1 }, set: { d_game: 1 }, next: "hub" },
  gn_four: { who: "voice", t: L("四。……その数字は、言わないでほしかった。ベッドの数みたいで。はずれです。", "four. ……i'd rather you hadn't said that one. it sounds like a bed number. wrong.", "Четыре. ……Лучше бы вы его не называли. Похоже на номер койки. Мимо."), add: { d_truth: 1 }, set: { d_game: 1 }, next: "hub" },

  game_hub1: { who: "voice", req: "d_game==1", alt: "game_hub2", t: L("数えっこです。あなたがここに来てから、廊下の蛍光灯は何回またたいたでしょう。", "counting game. since you got here, how many times has the corridor light flickered.", "Игра в счёт. С тех пор как вы пришли, сколько раз мигнула лампа в коридоре?"), choices: [
    { t: L("四回。", "Four.", "Четыре."), next: "gc_ans" },
    { t: L("七回。", "Seven.", "Семь."), next: "gc_ans" },
    { t: L("十一回。", "Eleven.", "Одиннадцать."), next: "gc_right" },
    { t: L("数えてない。患者を見てた。", "Didn't count. I was watching a patient.", "Не считал. Смотрел за пациентом."), next: "gc_duty", add: { d_trust: 1 } },
  ] },
  gc_ans: { who: "voice", t: L("十一回です。あなたがまばたきした回数と同じ。偶然ですね。偶然ということにしておきましょう。", "eleven. same as the number of times you blinked. coincidence. let's call it coincidence.", "Одиннадцать. Столько же, сколько вы моргнули. Совпадение. Пусть будет совпадение."), set: { d_game: 2 }, next: "hub" },
  gc_right: { who: "voice", t: L("十一。……数えていたんですか。私の真似をしないでください。一人で十分です。", "eleven. ……you were counting? don't copy me. one of us is enough.", "Одиннадцать. ……Вы считали? Не подражайте мне. Одного такого достаточно."), add: { d_gwin: 1 }, set: { d_game: 2 }, next: "hub" },
  gc_duty: { who: "voice", t: L("患者を。……ずるい答えです。でも、それが正解の人もいる。十一回でした。", "a patient. ……unfair answer. but for some people it's the right one. it was eleven.", "За пациентом. ……Нечестный ответ. Но для иных — правильный. Было одиннадцать."), set: { d_game: 2 }, next: "hub" },

  game_hub2: { who: "voice", req: "d_game==2", alt: "game_hub3", t: L("なぞなぞです。下手なやつ。針があるのに、いつまでも勤務が終わらないものは何でしょう。", "riddle. a bad one. what has hands but never finishes its shift.", "Загадка. Скверная. У кого есть стрелки, а смена всё не кончается?"), choices: [
    { t: L("時計。", "A clock.", "Часы."), next: "gr_clock" },
    { t: L("……俺。", "……Me.", "……У меня."), next: "gr_me", add: { d_truth: 1 } },
    { t: L("注射器。", "A syringe.", "Шприц."), next: "gr_syr", add: { d_trust: 1 } },
  ] },
  gr_clock: { who: "voice", t: L("はずれ。時計は勤務していません。止まっているだけ。……答えは、言わないでおきます。", "wrong. clocks don't work shifts. they just stop. ……i won't say the answer.", "Мимо. Часы не работают посменно. Они просто стоят. ……Ответ я не скажу."), set: { d_game: 3 }, next: "hub" },
  gr_me: { who: "voice", t: L("……それが答えでした。当てられるの、ほんとうに嫌いです。", "……that was the answer. i really hate it when people get it.", "……Это и был ответ. Терпеть не могу, когда угадывают."), add: { d_gwin: 1 }, set: { d_game: 3 }, next: "hub" },
  gr_syr: { who: "voice", t: L("注射器。……ははっ。いまの、笑いました。時刻を記録してください。三時三十三分。", "a syringe. ……ha. i laughed. note the time. 3:33.", "Шприц. ……Ха. Я рассмеялся. Запишите время. Три тридцать три."), set: { d_game: 3 }, next: "hub" },

  game_hub3: { who: "voice", req: "d_game==3", alt: "game_hub4", t: L("今日は、私の沈黙を数えてください。いきますよ。", "tonight, count my silences. ready.", "Сегодня посчитайте мои молчания. Начинаю."), next: "gs_b" },
  gs_b: { who: "voice", t: L("…………。……………………。…………。", "…………  ……………………  …………", "…………  ……………………  …………"), choices: [
    { t: L("三つ。", "Three.", "Три."), next: "gs_three" },
    { t: L("一つ。長いのが。", "One. A long one.", "Одно. Длинное."), next: "gs_one", add: { d_trust: 1 } },
    { t: L("数えるな、と言いたかった。", "I wanted to tell you to stop counting.", "Хотел сказать — перестань считать."), next: "gs_stop", add: { d_cold: 1 } },
  ] },
  gs_three: { who: "voice", t: L("三つ。正解。……あなたといると、正解ばかり出てくる。退屈で、少し安心します。", "three. correct. ……with you, everything comes out correct. boring. a little reassuring.", "Три. Верно. ……С вами всё выходит верно. Скучно. И чуточку утешительно."), add: { d_gwin: 1 }, set: { d_game: 4 }, next: "hub" },
  gs_one: { who: "voice", t: L("一つ。……そういう聞き方もあるんですね。あいだに息をしていても、同じ沈黙だと。", "one. ……so you can hear it that way. that it's the same silence, even with breaths in between.", "Одно. ……Вот как можно услышать. Что это одно молчание, хоть и с вдохами посреди."), set: { d_game: 4 }, next: "hub" },
  gs_stop: { who: "voice", t: L("数えるのをやめたら、私には何が残るんですか。……言ってみただけです。気にしないで。", "if i stop counting, what's left of me. ……i only said it. don't mind.", "Если я перестану считать, что от меня останется? ……Так, к слову. Не берите в голову."), set: { d_game: 4 }, next: "hub" },

  game_hub4: { who: "voice", t: L("しりとりにしましょう。私から。「よる」。", "word chain. i'll start. 'night'.", "Давайте в слова. Я начну. «Ночь»."), choices: [
    { t: L("「るすばん」。……あ。", "'Tired.' ……'Done.'", "«Чай». ……На «й» слов нет."), next: "gw_b" },
    { t: L("……「ルール」。終わりそうにないな。", "'Thursday.' ……'Yesterday.' This won't end.", "«Часы». ……«Сутки». Это надолго."), next: "gw_c", add: { d_trust: 1 } },
  ] },
  gw_b: { who: "voice", t: L("「ん」がつきました。おしまい。……わざとですね。終わらせ方は知っている人だ。遊びの、ですけど。", "done. you ended it on purpose. so you do know how to finish something. games, at least.", "Сдались нарочно. Хитро. Значит, заканчивать вы умеете. Хотя бы игры."), set: { d_game: 0 }, next: "hub" },
  gw_c: { who: "voice", t: L("終わらない。ええ、私たちのしりとりは、いつもそうなる。……また今度、続きから。", "never-ending. yes. our games always go that way. ……next time, we'll pick up where we left off.", "Бесконечно. Да. Наши игры всегда так. ……В другой раз продолжим с того же места."), set: { d_game: 0 }, next: "hub" },
});

// ------------------------------------------------------------------
// TIME (d_time 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  time1_a: { who: "voice", t: L("あなたが、いつも同じことを言うからです。三時三十三分。それを聞くのが好きなんです。一音だけの歌みたいで。", "because you always say the same thing. three thirty-three. i like hearing it. like a song with one note.", "Потому что вы всегда отвечаете одно и то же. Три тридцать три. Мне нравится это слышать. Как песня из одной ноты."), next: "time1_b" },
  time1_b: { who: "emrys", emo: "crossed", t: L("時計が壊れてるだけだ。修理には連絡してある。", "The clocks are broken. Maintenance knows.", "Часы сломаны. Ремонтникам сообщили."), next: "time1_c" },
  time1_c: { who: "voice", t: L("修理。……修理の人を、最後に見たのはいつですか。", "maintenance. ……when did you last see maintenance.", "Ремонтникам. ……Когда вы в последний раз видели ремонтника?"), choices: [
    { t: L("火曜日。", "Tuesday.", "Во вторник."), next: "time1_tue" },
    { t: L("日勤の時間に来るんだろ。", "They come during the day shift.", "Они приходят в дневную смену."), next: "time1_day", add: { d_refuse: 1 } },
    { t: L("……覚えてない。", "……I don't remember.", "……Не помню."), next: "time1_honest", add: { d_truth: 1, d_trust: 1 } },
  ] },
  time1_tue: { who: "voice", t: L("火曜日。……どの火曜日。", "tuesday. ……which tuesday.", "Во вторник. ……В который вторник?"), next: "time1_tue2" },
  time1_tue2: { who: "emrys", emo: "ponder", t: L("……ある火曜日だ。", "……A Tuesday.", "……В какой-то."), next: "time1_end", add: { d_truth: 1 } },
  time1_day: { who: "voice", t: L("日勤。会ったことはありますか、日勤の人たちに。", "the day shift. have you ever met them. the day shift.", "Дневная смена. Вы с ней встречались когда-нибудь?"), next: "time1_day2" },
  time1_day2: { who: "emrys", emo: "normal", t: L("引き継ぎで顔を合わせる。八時に。", "At handover. At eight.", "На пересменке. В восемь."), next: "time1_day3" },
  time1_day3: { who: "voice", t: L("八時は、いつ来ますか。", "and when is eight.", "А когда наступает восемь?"), next: "time1_day4" },
  time1_day4: { who: "emrys", emo: "annoyed", t: L("……三時三十三分のあと、ふつうは。", "……After three thirty-three. Usually.", "……После трёх тридцати трёх. Обычно."), next: "time1_day5" },
  time1_day5: { who: "voice", t: L("ふつうは。", "usually.", "Обычно."), next: "time1_end" },
  time1_honest: { who: "voice", t: L("よかった。正直な数字です。ゼロ。", "good. that's an honest number. zero.", "Славно. Честное число. Ноль."), next: "time1_end" },
  time1_end: { who: "voice", t: L("また次も聞きます。何時ですか、って。あなたは答える。いい取り決めでしょう。", "i'll ask again next time. what time it is. you'll answer. it's a nice arrangement.", "Я спрошу и в следующий раз. Который час. Вы ответите. Хороший уговор, правда?"), set: { d_time: 1 }, next: "hub" },

  time2_a: { who: "voice", t: L("何にも。それがこつです。何かに向かって数えると、それが来てしまう。私は横に数えるんです。", "nothing. that's the trick. if you count toward something, it arrives. i count sideways.", "Ни до чего. В том-то и хитрость. Если считать к чему-то, оно придёт. Я считаю вбок."), next: "time2_b" },
  time2_b: { who: "emrys", emo: "think", t: L("横に。", "Sideways.", "Вбок."), next: "time2_c" },
  time2_c: { who: "voice", t: L("一、一、一、一。とても落ち着きます。あなたも試してみたらいい。こんなに長く勤務しているんだから。", "one, one, one, one. very restful. you should try it. you've been on shift so long.", "Раз, раз, раз, раз. Очень успокаивает. Попробуйте. Вы так давно на смене."), next: "time2_d" },
  time2_d: { who: "emrys", emo: "wary", t: L("どのくらい。", "How long.", "Сколько."), next: "time2_e" },
  time2_e: { who: "voice", t: L("どのくらいだと思いますか。", "how long do you think.", "А вы как думаете?"), choices: [
    { t: L("一晩だ。", "One night.", "Одну ночь."), next: "time2_one", add: { d_refuse: 1 } },
    { t: L("コーヒーが冷めなくなるくらい長く。", "Long enough that my coffee stopped going cold.", "Достаточно, чтобы кофе перестал остывать."), next: "time2_coffee", add: { d_truth: 2 } },
    { t: L("関係ない。患者は待ってくれない。", "Doesn't matter. Patients don't wait.", "Неважно. Пациенты не ждут."), next: "time2_pat", add: { d_cold: 1 } },
  ] },
  time2_one: { who: "voice", t: L("一晩。ええ。とてもよくできた一晩です。折り鶴みたいに、何度も折りたたんで。", "one night. yes. one very well-made night. folded many times, like a paper crane.", "Одну ночь. Да. Одну очень искусную ночь. Сложенную много раз, как бумажный журавлик."), next: "time2_end" },
  time2_coffee: { who: "voice", t: L("……気づいていたんですね。たいていの人は気づかない。置いたときの温度のまま、ずっとそこにある。", "……you noticed. most don't. it stays exactly the temperature you left it.", "……Заметили. Большинство не замечает. Он так и стоит той температуры, какой вы его оставили."), next: "time2_end" },
  time2_pat: { who: "voice", t: L("そうですね。待ってくれない。ここで動いているのは、あの人たちだけです。", "no. they don't. they're the only thing here that moves.", "Нет. Не ждут. Здесь движутся только они."), next: "time2_end" },
  time2_end: { who: "voice", t: L("考えているあいだに、まばたきを数えました。十一回。嘘をつくとき、あなたはまばたきが増える。今のは嘘じゃなかった。たぶん。", "i counted your blinks while you thought. eleven. you blink more when you lie. that wasn't a lie. probably.", "Пока вы думали, я считал моргания. Одиннадцать. Когда вы лжёте, моргаете чаще. Это была не ложь. Наверное."), set: { d_time: 2 }, next: "hub" },

  time3_a: { who: "voice", t: L("……聞きましたね。とうとう聞いた。", "……you asked. you finally asked.", "……Спросили. Наконец-то спросили."), next: "time3_b" },
  time3_b: { who: "voice", t: L("長針が三十四に行きます。そうしたら、三十四分に何かが起きなくちゃいけない。起きたことは、起きなかったことにはならない。", "the minute hand goes to thirty-four. and then something has to happen at thirty-four. and things that happen don't un-happen.", "Минутная стрелка сдвинется на тридцать четыре. И тогда в тридцать четыре что-то должно случиться. А случившееся не отменишь."), next: "time3_c" },
  time3_c: { who: "emrys", emo: "crossed", t: L("時間ってのは、だいたいそういうものだ。", "That's how time works. Generally.", "Время вообще так устроено."), next: "time3_d" },
  time3_d: { who: "voice", t: L("だいたいは。……ここでは、時間は引き出しにしまってあるんです。誰かが、もう少しだけ時間がほしくて、しまった。何かを終わらせるために。", "generally. ……here, time is kept in a drawer. someone put it there to have a little more of it. to finish something.", "Вообще. ……А здесь время держат в ящике. Кто-то спрятал его туда, чтобы выгадать ещё чуть-чуть. Чтобы что-то закончить."), next: "time3_e" },
  time3_e: { who: "emrys", emo: "wary", t: L("何を。", "Finish what.", "Что закончить."), next: "time3_f" },
  time3_f: { who: "voice", t: L("勤務を。文章を。患者を。……あなたが教えてください、先生。", "a shift. a sentence. a patient. ……you tell me, doctor.", "Смену. Фразу. Пациента. ……Скажите мне вы, доктор."), choices: [
    { t: L("動かしてやれ。", "Let it move.", "Пусть идут."), next: "time3_move", add: { d_truth: 2 } },
    { t: L("引き出しにしまっておけ。", "Keep it in the drawer.", "Пусть лежит в ящике."), next: "time3_keep", add: { d_cold: 1, d_refuse: 1 } },
    { t: L("三時三十四分に何があるのか、知りたい。", "I'd like to know what's at 3:34.", "Я хотел бы знать, что там, в три тридцать четыре."), next: "time3_curious", add: { d_truth: 1, d_trust: 1 } },
  ] },
  time3_move: { who: "voice", t: L("勇気がある。それとも疲れている。あなたの場合、その二つの区別がつかない。……言ったこと、覚えておきます。あとで大事になる。", "brave. or tired. with you i can't tell the difference. ……i'll remember you said that. it'll matter later.", "Смело. Или от усталости. У вас одно от другого не отличить. ……Я запомню, что вы это сказали. Потом пригодится."), next: "time3_end" },
  time3_keep: { who: "voice", t: L("ええ。引き出しの中は暖かい。中にいる人はみんな安全。……そして、誰も出られない。", "yes. the drawer is warm. everyone in the drawer is safe. ……and nobody gets out.", "Да. В ящике тепло. Все, кто внутри, в безопасности. ……И никто не выходит."), next: "time3_end" },
  time3_curious: { who: "voice", t: L("好奇心。私もそれで始まったんです。……「私も」は余計でした。", "curiosity. that's how i started, too. ……i shouldn't have said 'too'.", "Любопытство. С него и я начинал. ……«И я» — лишнее."), next: "time3_end" },
  time3_end: { who: "voice", t: L("……三時三十三分ですよね。", "……it's 3:33, isn't it.", "……Ведь три тридцать три, не так ли."), next: "time3_end2" },
  time3_end2: { who: "emrys", emo: "ponder", t: L("……ああ。", "……Yeah.", "……Да."), next: "time3_end3" },
  time3_end3: { who: "voice", t: L("よかった。まだ。", "good. still.", "Хорошо. Пока ещё."), set: { d_time: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// DEATH (d_death 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  death1_a: { who: "voice", t: L("ここにいる人は、みんな見ていますよ。人が死ぬのを。この建物の性格みたいなものです。", "everyone here has seen people die. it's the building's whole personality.", "Здесь все видели, как умирают. Это, можно сказать, характер здания."), next: "death1_b" },
  death1_b: { who: "emrys", emo: "normal", t: L("それはそうだ。", "Fair.", "Справедливо."), next: "death1_c" },
  death1_c: { who: "voice", t: L("私の意見、聞きたいですか。いい意見じゃありません。小さくて、けちな意見です。", "do you want my opinion. it isn't a good one. it's small and petty.", "Хотите моё мнение? Оно нехорошее. Мелкое и мелочное."), next: "death1_d" },
  death1_d: { who: "emrys", emo: "think", t: L("言ってみろ。", "Go on.", "Давай."), next: "death1_e" },
  death1_e: { who: "voice", t: L("死は、失礼です。何時に来るか、絶対に言わない。時間を教えてくれれば、私はちゃんと間に合うのに。私は時間には正確なんです。", "death is rude. it never says what time it's coming. if it told me the time i'd be punctual. i'm always punctual.", "Смерть невежлива. Никогда не скажет, в котором часу придёт. Назови она время — я был бы точен. Я всегда точен."), next: "death1_f" },
  death1_f: { who: "emrys", emo: "crossed", t: L("患者もだいたい同じことを言う。", "Most patients would agree.", "Пациенты в основном согласились бы."), next: "death1_g" },
  death1_g: { who: "voice", t: L("あなたは、死を何だと思いますか。私よりずっとたくさん見ているでしょう。", "what do you think it is. you see it much more than i do.", "А вы что думаете о ней? Вы ведь видите её куда чаще меня."), choices: [
    { t: L("交代の時間だ。", "A shift change.", "Пересменка."), next: "death1_shift", add: { d_truth: 1 } },
    { t: L("書類。大量の書類。", "Paperwork. A lot of paperwork.", "Бумаги. Очень много бумаг."), next: "death1_paper", add: { d_trust: 1 } },
    { t: L("失敗だ。俺の。", "Failure. Mine.", "Провал. Мой."), next: "death1_fail", add: { d_truth: 1 } },
    { t: L("俺の担当じゃない。", "Not my department.", "Не мой профиль."), next: "death1_dept", add: { d_refuse: 1, d_cold: 1 } },
  ] },
  death1_shift: { who: "voice", t: L("……ああ。それはいい。もらいます。誰かが代わりにカルテを持って、あなたは家に帰る。", "……oh. that's good. i'll keep that one. someone else picks up the chart. you go home.", "……О. Хорошо. Возьму себе. Кто-то другой берёт карту, а вы идёте домой."), next: "death1_shift2" },
  death1_shift2: { who: "voice", t: L("先生は、家に帰りますか。", "do you go home, doctor.", "А вы ходите домой, доктор?"), next: "death1_shift3" },
  death1_shift3: { who: "emrys", emo: "ponder", t: L("……そのうちな。", "……Eventually.", "……Когда-нибудь."), next: "death1_end" },
  death1_paper: { who: "voice", t: L("ふっ。……いま、笑いました。時刻を記録しておいてください。", "ha. ……i laughed. note the time.", "Ха. ……Я рассмеялся. Запишите время."), next: "death1_paper2" },
  death1_paper2: { who: "emrys", emo: "normal", t: L("三時三十三分。", "Three thirty-three.", "Три тридцать три."), next: "death1_end" },
  death1_fail: { who: "voice", t: L("あなたは、そこまで偉くない。……すみません。意地悪でした。でも、偉くない。人はあなたの許可なしに死にます。それは、あの人たちにとって一種の自由です。", "you're not that important. ……sorry. that was unkind. but you're not. people die without your permission. it's a kind of freedom. for them.", "Вы не настолько важны. ……Простите. Это было злобно. Но не настолько. Люди умирают без вашего позволения. Это своего рода свобода. Для них."), next: "death1_end" },
  death1_dept: { who: "voice", t: L("ここには、その科しかありませんよ。", "it's the only department here.", "Здесь другого профиля и нет."), next: "death1_end" },
  death1_end: { who: "voice", t: L("……扉の下の光、いま少しだけ揺れました。気にしないで。", "……the light under the door flickered just now. don't mind it.", "……Свет под дверью сейчас дрогнул. Не обращайте внимания."), set: { d_death: 1 }, next: "hub" },

  death2_a: { who: "voice", t: L("書類にサインするのはあなたでしょう。知っているはずです。", "you sign the forms. you'd know.", "Бумаги подписываете вы. Вам и знать."), next: "death2_b" },
  death2_b: { who: "emrys", emo: "think", t: L("書くのは「退院」だけだ。「どこへ」は書かない。", "I write 'discharged.' I don't write 'to where.'", "Я пишу «выписан». «Куда» — не пишу."), next: "death2_c" },
  death2_c: { who: "voice", req: "oda_done", alt: "death2_c_alt", t: L("オダさん。スリッパを、ベッドの横に揃えていったでしょう。窓のほうに向けて。……裸足で病院を出る人はいませんよ、先生。行く先が暖かい場合を除いて。", "oda left his slippers by the bed, didn't he. pointing toward the window. ……nobody walks out of a hospital barefoot, doctor. unless where they're going is warm.", "Ода оставил тапочки у кровати, верно? Носками к окну. ……Босиком из больницы не уходят, доктор. Разве что туда, где тепло."), next: "death2_d" },
  death2_c_alt: { who: "voice", t: L("患者さんは物を置いていきます。スリッパ。一マスだけ空いたクロスワード。……裸足で病院を出る人はいませんよ、先生。行く先が暖かい場合を除いて。", "patients leave things behind. slippers. a crossword with one square missing. ……nobody walks out of a hospital barefoot, doctor. unless where they're going is warm.", "Пациенты оставляют вещи. Тапочки. Кроссворд с одной пустой клеткой. ……Босиком из больницы не уходят, доктор. Разве что туда, где тепло."), next: "death2_d" },
  death2_d: { who: "emrys", emo: "ponder", t: L("…………。", "…………", "…………"), next: "death2_e" },
  death2_e: { who: "voice", t: L("もう知っているでしょう。最初の退院のときから。ただ、その「知っている」を、白衣のポケットに、ペンと一緒にしまっているだけです。", "you already know. you've known since your first discharge. you just keep the knowing in your coat pocket. with the pens.", "Вы уже знаете. С первой же выписки. Просто держите это знание в кармане халата. Вместе с ручками."), choices: [
    { t: L("……知ってる。", "……I know.", "……Знаю."), next: "death2_know", add: { d_truth: 2 } },
    { t: L("家に帰るんだ。", "They go home.", "Они идут домой."), next: "death2_home", add: { d_trust: 1 } },
    { t: L("やめろ。", "Stop.", "Хватит."), next: "death2_stop", add: { d_refuse: 1 } },
  ] },
  death2_know: { who: "voice", t: L("……ありがとう。誰かが口に出してくれると、楽になります。短い言葉でも。", "……thank you. it's easier when someone says it out loud. even a short word.", "……Спасибо. Легче, когда кто-то произносит вслух. Пусть даже коротко."), next: "death2_end" },
  death2_home: { who: "voice", t: L("ええ。家に。その言葉にしておきましょう。いい言葉です。", "yes. home. let's use that word. it's a good word.", "Да. Домой. Пусть будет это слово. Хорошее слово."), next: "death2_end" },
  death2_stop: { who: "voice", t: L("やめます。……ごめんなさい。怖がっていないあなたのほうが好きなんです。勝手ですね。", "stopping. ……i'm sorry. i like you better when you're not frightened. that's selfish.", "Перестаю. ……Простите. Вы мне больше нравитесь, когда не боитесь. Это себялюбиво."), next: "death2_end" },
  death2_end: { who: "narr", t: L("廊下のどこかで、空のベッドのシーツが一度だけ、風もないのにふくらんだ。", "Somewhere down the corridor, the sheet on an empty bed lifts once, though there is no draft.", "Где-то в коридоре простыня на пустой койке раз приподнялась, хоть сквозняка и нет."), set: { d_death: 2 }, next: "hub" },

  death3_a: { who: "voice", t: L("……小さな扉に、大きな質問ですね。", "……that's a big question for a small door.", "……Большой вопрос для маленькой двери."), next: "death3_b" },
  death3_b: { who: "voice", t: L("私には、名前のつくものが何もないんです。昔は医者だった。それとも、その医者が歩いた廊下だった。それとも、電気が消えたあとに残る、夜のひとかけら。どれか選んでください。全部、値下げ中です。", "i'm not anything that has a word. i was a doctor once. or the hallway the doctor walked down. or the bit of night that stays after the lights go off. pick one. they're all on sale.", "У меня нет ничего, что имело бы название. Когда-то я был врачом. Или коридором, по которому ходил врач. Или клочком ночи, что остаётся, когда гасят свет. Выбирайте. Всё по сниженной цене."), next: "death3_c" },
  death3_c: { who: "emrys", emo: "annoyed", t: L("答えになってない。", "That's not an answer.", "Это не ответ."), next: "death3_d" },
  death3_d: { who: "voice", t: L("先生は、死んでいますか。", "are you dead, doctor.", "А вы мертвы, доктор?"), next: "death3_e" },
  death3_e: { who: "narr", t: L("長い沈黙。換気扇が、一度だけ止まる。", "A long silence. The vent stops, once.", "Долгое молчание. Вентиляция на миг затихает."), next: "death3_f" },
  death3_f: { who: "emrys", emo: "normal", t: L("……勤務中だ。", "……I'm on shift.", "……Я на смене."), next: "death3_g" },
  death3_g: { who: "voice", t: L("それも答えになっていない。ほら。おそろいだ。", "that's not an answer either. see. we match.", "И это не ответ. Видите. Мы одинаковые."), choices: [
    { t: L("……そうかもしれない。", "……Maybe I am.", "……Может, и мёртв."), next: "death3_maybe", add: { d_truth: 2, d_trust: 1 } },
    { t: L("違う。だったら気づいてる。", "No. I'd have noticed.", "Нет. Я бы заметил."), next: "death3_no", add: { d_refuse: 1 } },
    { t: L("関係ない。誰かがここにいなきゃいけない。", "Doesn't matter. Someone has to be here.", "Неважно. Кто-то должен быть здесь."), next: "death3_duty", add: { d_cold: 1 } },
  ] },
  death3_maybe: { who: "narr", t: L("扉の向こうで、何かが近づいた。足音ではない。ただ、近くなった。", "Something on the other side of the door comes closer. Not a step. Just closer.", "По ту сторону двери что-то приблизилось. Не шаг. Просто стало ближе."), next: "death3_maybe2" },
  death3_maybe2: { who: "voice", t: L("だったら、あなたはそこで一人じゃない。それだけは記録に残しておいてください。", "then you're not alone in it. i want that on the record.", "Тогда вы в этом не одни. Прошу занести в протокол."), next: "death3_end" },
  death3_no: { who: "voice", t: L("気づきますか。あなた、食事をしたかどうかも気づかないのに。", "would you. you don't notice when you've eaten.", "Заметили бы? Вы не замечаете даже, ели ли."), next: "death3_end" },
  death3_duty: { who: "voice", t: L("ええ。誰かが。……どうしていつも、その誰かがあなたなんですか。", "yes. someone. ……why does it always have to be you.", "Да. Кто-то. ……Почему всегда этот кто-то — вы?"), next: "death3_end" },
  death3_end: { who: "voice", t: L("扉の下の光はね、嘘をつかれると揺れるんです。いまは揺れなかった。", "the light under the door flickers when someone lies. it didn't just now.", "Свет под дверью дрожит, когда лгут. Сейчас не дрогнул."), set: { d_death: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// LONELINESS (d_lonely 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  lone1_a: { who: "voice", t: L("寂しい。……私には暗がりがあります。とても広い。角がたくさんある。お気に入りの角もある。", "lonely. ……i have the dark. it's very large. it has a lot of corners. i have favorites.", "Одиноко. ……У меня есть темнота. Она огромная. В ней много углов. Есть любимые."), next: "lone1_b" },
  lone1_b: { who: "emrys", emo: "think", t: L("お気に入りの角。", "Favorite corners.", "Любимые углы."), next: "lone1_c" },
  lone1_c: { who: "voice", t: L("実は、あなたがいま立っているのが、そのひとつです。外側の、扉の下の暗がり。左へどうぞ。", "you're standing on one, actually. the outside one. under the door. move left, please.", "Вообще-то вы стоите на одном из них. На внешнем, под дверью. Левее, будьте любезны."), next: "lone1_d" },
  lone1_d: { who: "narr", t: L("エムリスは一歩、左へずれる。", "Emrys takes one step to the left.", "Эмрис делает шаг влево."), next: "lone1_e" },
  lone1_e: { who: "voice", t: L("どうも。……寂しいんじゃありません。静かなだけ。みんな、その二つを取り違える。先生は、寂しいですか。", "thank you. ……it isn't lonely. it's quiet. people confuse the two. are you lonely, doctor.", "Благодарю. ……Это не одиночество. Это тишина. Их всё путают. А вам одиноко, доктор?"), choices: [
    { t: L("ツブがいる。", "I have Tsubu.", "У меня есть Цубу."), next: "lone1_tsubu", add: { d_trust: 1 } },
    { t: L("患者がいる。", "I have patients.", "У меня есть пациенты."), next: "lone1_pat", add: { d_cold: 1 } },
    { t: L("……ときどきは。", "……Sometimes.", "……Иногда."), next: "lone1_some", add: { d_truth: 1, d_trust: 1 } },
  ] },
  lone1_tsubu: { who: "voice", t: L("あの豆。ええ。よく叫びますね。あれは効く。", "the bean. yes. it shouts. that helps.", "Фасолинка. Да. Она кричит. Это помогает."), next: "lone1_end" },
  lone1_pat: { who: "voice", t: L("患者は帰っていきます。それが患者というものです。", "patients leave. that's the whole point of them.", "Пациенты уходят. В этом их суть."), next: "lone1_end" },
  lone1_some: { who: "voice", t: L("ときどき。正直な量ですね。", "sometimes. that's an honest amount.", "Иногда. Честная мера."), next: "lone1_end" },
  lone1_end: { who: "voice", t: L("……もう右に戻っていいですよ。暗がりが、少し寂しがっている。", "……you can step back right now. the dark misses you a little.", "……Можете вернуться правее. Темнота немного соскучилась."), set: { d_lonely: 1 }, next: "hub" },

  lone2_a: { who: "voice", t: L("……そういうことを聞かないでください。ないものまで数えたくなる。", "……don't ask that. it makes me count things that aren't there.", "……Не спрашивайте такого. Хочется пересчитать то, чего нет."), next: "lone2_b" },
  lone2_b: { who: "voice", t: L("はい、と言ったら、あなたは責任を感じるでしょう。あなたは責任を集めるんです。切手を集めるみたいに。", "if i say yes you'll feel responsible. you collect responsibilities. like other people collect stamps.", "Скажу «да» — вы почувствуете ответственность. Вы собираете ответственность. Как другие марки."), next: "lone2_c" },
  lone2_c: { who: "emrys", emo: "crossed", t: L("切手のほうが、まだ平たいな。", "Stamps are at least flat.", "Марки хоть плоские."), next: "lone2_d" },
  lone2_d: { who: "voice", t: L("……ええ。来てください。一回だけ言います。", "……yes. come back. i'm saying it once.", "……Да. Приходите. Говорю один раз."), choices: [
    { t: L("来る。", "I'll come.", "Приду."), next: "lone2_come", add: { d_trust: 1 } },
    { t: L("努力はする。", "I'll try.", "Постараюсь."), next: "lone2_try", add: { d_truth: 1 } },
    { t: L("保証はしない。", "No guarantees.", "Без гарантий."), next: "lone2_no", add: { d_cold: 1 } },
  ] },
  lone2_come: { who: "voice", t: L("約束はしないで。ここの約束は期限が切れないんです。ずっと残る。コーヒーみたいに。", "don't promise. promises here don't expire. they just stay. like the coffee.", "Не обещайте. Обещания здесь не истекают. Так и стоят. Как кофе."), next: "lone2_end" },
  lone2_try: { who: "voice", t: L("努力。いいですね。努力は、失敗してもいいことになっている。", "trying. good. trying is allowed to fail.", "Постараться. Хорошо. Стараниям позволено не удаваться."), next: "lone2_end" },
  lone2_no: { who: "voice", t: L("ええ。保証なんて、ここには一度もなかった。いいです。", "no. there never were any. fine.", "Да. Гарантий здесь отродясь не бывало. Ладно."), next: "lone2_end" },
  lone2_end: { who: "voice", t: L("……今の、聞かなかったことにしてもいいですよ。私は覚えていますけど。", "……you can pretend you didn't hear that. i'll remember it, though.", "……Можете сделать вид, что не слышали. Я-то запомню."), set: { d_lonely: 2 }, next: "hub" },

  lone3_a: { who: "voice", t: L("……毎晩来る医者がいました。扉に背中を預けて、床に座って。あまりしゃべらなかった。", "……there was a doctor who came. every night. he'd sit on the floor with his back to the door. he didn't say much.", "……Был один врач. Приходил каждую ночь. Садился на пол, спиной к двери. Говорил мало."), next: "lone3_b" },
  lone3_b: { who: "voice", t: L("プリンを食べて、蓋を隙間のところに置いていくんです。私が匂いをかげるように。", "he'd eat a pudding and leave the lid by the gap so i could smell it.", "Съедал пудинг и оставлял крышечку у щели, чтобы я мог понюхать."), next: "lone3_c" },
  lone3_c: { who: "emrys", emo: "ponder", t: L("…………。", "…………", "…………"), next: "lone3_d" },
  lone3_d: { who: "voice", t: L("あなたと同じ息の仕方をしていた。……ありえないことですけど。", "he breathed like you. ……that isn't possible, of course.", "Он дышал как вы. ……Это невозможно, конечно."), next: "lone3_e" },
  lone3_e: { who: "emrys", emo: "wary", t: L("その医者は、どうなった。", "What happened to him.", "Что с ним стало."), next: "lone3_f" },
  lone3_f: { who: "voice", t: L("来なくなりました。それから、あなたが来るようになった。そのあいだは……三時三十三分でした。とても短くて、とても長かった。", "he stopped coming. then you started. the gap in between was — well. it was 3:33. very short and very long.", "Перестал приходить. Потом стали приходить вы. А промежуток был… ну. Три тридцать три. Очень короткий и очень долгий."), choices: [
    { t: L("……来なくなったんじゃないのかもしれない。", "……Maybe he didn't stop.", "……Может, он и не переставал."), next: "lone3_didnt", add: { d_truth: 2 } },
    { t: L("じゃあ、座る。", "I'll sit, then.", "Тогда я сяду."), next: "lone3_sit", add: { d_trust: 2 } },
    { t: L("ひどい医者だな。そんなふうに来なくなるなんて。", "Sounds like a bad doctor. Leaving like that.", "Скверный врач. Вот так взять и пропасть."), next: "lone3_bad", add: { d_cold: 1 } },
  ] },
  lone3_didnt: { who: "voice", t: L("……かもしれません。来たことを、忘れただけかもしれない。忘れるのは、いなくなることとは違いますから。", "……maybe. maybe he just forgot he'd been coming. forgetting isn't the same as leaving.", "……Может быть. Может, он просто забыл, что приходил. Забыть — не то же, что уйти."), next: "lone3_end" },
  lone3_sit: { who: "narr", t: L("エムリスは床に座り、扉に背中を預ける。冷たさは、思ったよりやさしい。", "Emrys sits down on the floor, his back against the door. The cold is gentler than he expected.", "Эмрис садится на пол, прислонившись спиной к двери. Холод мягче, чем он думал."), next: "lone3_sit2" },
  lone3_sit2: { who: "voice", t: L("……ありがとう。背中の高さ、同じです。", "……thank you. your back is at the same height.", "……Спасибо. Спина на той же высоте."), next: "lone3_end" },
  lone3_bad: { who: "voice", t: L("やめて。……あの人のことを、そういうふうに言わないで。あの人は、とても疲れていたんです。", "don't. ……don't talk about him like that. he was so tired.", "Не надо. ……Не говорите о нём так. Он так устал."), next: "lone3_end" },
  lone3_end: { who: "voice", t: L("今夜はもう少し、そこにいてください。何も言わなくていいです。息だけ数えますから。", "stay a little longer tonight. you don't have to say anything. i'll just count your breathing.", "Побудьте ещё немного. Можно молчать. Я просто посчитаю ваше дыхание."), set: { d_lonely: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// MEMORY (d_mem 0..3; d_key 1 = both return, 2 = keep, 3 = remember for you)
// ------------------------------------------------------------------
Object.assign(N, {
  mem1_a: { who: "voice", t: L("持論があります。記憶は、借りている部屋なんです。", "i have a theory. memory is a room you rent.", "У меня есть теория. Память — это комната, которую снимаешь."), next: "mem1_b" },
  mem1_b: { who: "emrys", emo: "think", t: L("借りてる。", "Rent.", "Снимаешь."), next: "mem1_c" },
  mem1_c: { who: "voice", t: L("家賃は注意で払う。払うのをやめると、大家さんが来ます。とても礼儀正しく。家具を運び出して、匂いだけ残していく。", "you pay in attention. stop paying and the landlord comes. very polite. takes the furniture. leaves the smell.", "Платишь вниманием. Перестанешь — придёт хозяин. Очень учтивый. Вынесет мебель. Оставит запах."), next: "mem1_d" },
  mem1_d: { who: "emrys", emo: "crossed", t: L("鍵は。", "And the key.", "А ключ."), next: "mem1_e" },
  mem1_e: { who: "voice", t: L("返すんです。忘れるっていうのは、それだけ。鍵を返すこと。みんな泥棒にでも入られたみたいに騒ぐけど、ただのチェックアウトです。", "you give it back. that's all forgetting is. returning a key. people act like they've been robbed. it's just checkout.", "Отдаёшь. Вот и всё забвение. Вернуть ключ. Все шумят, будто их обокрали. А это просто выезд."), choices: [
    { t: L("あんたは、まだ何を借りてる。", "Then what do you still rent.", "А ты что ещё снимаешь."), next: "mem1_rent", add: { d_truth: 1 } },
    { t: L("安いモーテルみたいだな。", "Sounds like a cheap motel.", "Похоже на дешёвый мотель."), next: "mem1_motel", add: { d_trust: 1 } },
    { t: L("俺は家具を手放したくない。", "I'd rather keep the furniture.", "Я бы мебель оставил."), next: "mem1_keep", add: { d_cold: 1 } },
  ] },
  mem1_rent: { who: "voice", t: L("一部屋だけ。小さい。窓があって、ガラスにひびが入っている。「E」の字の形をしたひび。……どうしてその部屋を手放さないのか、自分でもわからない。", "one room. small. there's a window with a crack in the glass shaped like the letter e. ……i don't know why i keep it.", "Одну. Маленькую. Там окно, и в стекле трещина в форме буквы «Э». ……Сам не знаю, зачем держу её."), next: "mem1_end" },
  mem1_motel: { who: "voice", t: L("そうです。朝食もつきません。", "it is. no breakfast.", "Он и есть. Без завтрака."), next: "mem1_end" },
  mem1_keep: { who: "voice", t: L("みんなそうです。だから、ここの部屋はどこもいっぱいなんです。", "everyone would. that's why every room here is so full.", "Все бы оставили. Потому-то все палаты здесь так заставлены."), next: "mem1_end" },
  mem1_end: { who: "voice", t: L("家賃の支払いは、今夜のぶん、済んでいますよ。私と話したから。", "your rent's paid for tonight. you talked to me.", "За сегодня плата внесена. Вы со мной поговорили."), set: { d_mem: 1 }, next: "hub" },

  mem2_a: { who: "voice", t: L("あなたは正面から入ってきました。コートを着て。鞄を持たずに。医者は、たいてい鞄を持っているのに。", "you came in through the front. in your coat. no bag. doctors always have a bag.", "Вы вошли с парадного. В пальто. Без саквояжа. А у врачей он всегда есть."), next: "mem2_b" },
  mem2_b: { who: "voice", t: L("受付に長いこと座っていた。誰もいないのに「わかった」って言った。それから白衣を着て、働きはじめた。", "you sat in reception for a long time. you said 'okay' to nobody. then you put on the coat and started working.", "Долго сидели в регистратуре. Сказали «ладно» в пустоту. Потом надели халат и принялись за работу."), next: "mem2_c" },
  mem2_c: { who: "emrys", emo: "wary", t: L("……覚えてない。", "……I don't remember that.", "……Я этого не помню."), next: "mem2_d" },
  mem2_d: { who: "voice", t: L("ええ。その鍵は、早めに返したんですね。", "no. you returned that key early.", "Да. Этот ключ вы вернули рано."), choices: [
    { t: L("もっと聞かせてくれ。", "Tell me more.", "Расскажи ещё."), next: "mem2_more", add: { d_truth: 1 } },
    { t: L("作り話だろ。", "You're making it up.", "Ты это выдумываешь."), next: "mem2_lie", add: { d_refuse: 1 } },
    { t: L("……俺は、一人だったか。", "……Was I alone.", "……Я был один."), next: "mem2_alone", add: { d_truth: 1, d_trust: 1 } },
  ] },
  mem2_more: { who: "voice", t: L("靴が濡れていました。雨は降っていなかったのに。……それだけ。今夜はそれだけです。", "your shoes were wet. it wasn't raining. ……that's all. that's all for tonight.", "Ботинки были мокрые. А дождя не было. ……Всё. На сегодня всё."), next: "mem2_end" },
  mem2_lie: { who: "voice", t: L("かもしれません。記憶と作り話は、いとこ同士です。洗面所を共有している。", "maybe. memory and making things up are cousins. they share a bathroom.", "Может быть. Память и выдумка — кузины. У них общая ванная."), next: "mem2_end" },
  mem2_alone: { who: "voice", t: L("いいえ。ポケットに何かが入っていました。からからと鳴った。錠剤みたいに。小さな声みたいに。", "no. something was in your pocket. it rattled. like pills. like a small voice.", "Нет. В кармане у вас что-то было. Погромыхивало. Как таблетки. Как маленький голос."), next: "mem2_end" },
  mem2_end: { who: "voice", t: L("私が覚えていることを、あなたが覚えていない。これって、どちらの部屋なんでしょうね。", "i remember what you don't. whose room is that, i wonder.", "Я помню то, чего не помните вы. Чья же это комната, хотел бы я знать."), set: { d_mem: 2 }, next: "hub" },

  mem3_a: { who: "voice", t: L("あなたの？　形が残ります。ペンの持ち方。疲れ……いや、疲れは一緒に出ていく。そこがいいところです。", "of you? the shape. the way you hold a pen. the tiredness — no. the tiredness goes too. that's the nice part.", "От вас? Очертания. Как вы держите ручку. Усталость… нет, усталость тоже уйдёт. Это и хорошо."), next: "mem3_b" },
  mem3_b: { who: "voice", t: L("私の？　わかりません。鍵をひとつ、長く握りすぎて、温かくなってしまった。", "of me? i don't know. i've held one key so long it's gone warm.", "От меня? Не знаю. Я так долго сжимаю один ключ, что он стал тёплым."), next: "mem3_c" },
  mem3_c: { who: "emrys", emo: "think", t: L("どの鍵だ。", "Which key.", "Какой ключ."), next: "mem3_d" },
  mem3_d: { who: "voice", t: L("あなたの。……いえ、私の。いや、「E」のひびがある部屋の。", "yours. ……i mean mine. i mean the one for the room with the e in the glass.", "Ваш. ……То есть мой. То есть от комнаты, где в стекле «Э»."), next: "mem3_e" },
  mem3_e: { who: "narr", t: L("扉の隙間から、小さな金属がこすれる音がした。何かを、ずっと手のひらで転がしている音。", "From the gap comes the faint scrape of small metal. Something being turned over and over in a palm.", "Из щели слышится тихий скрежет металла. Что-то без конца перекатывают в ладони."), choices: [
    { t: L("なら、二人で一緒に返そう。", "Then let's both give ours back.", "Тогда вернём оба. Вместе."), next: "mem3_both", set: { d_key: 1 }, add: { d_truth: 1 } },
    { t: L("俺は自分のを持っておく。嫌な部屋も含めて。", "I'll keep mine. Even the bad rooms.", "Свой оставлю. Даже плохие комнаты."), next: "mem3_keep", set: { d_key: 2 }, add: { d_trust: 1 } },
    { t: L("あんたのは持ってていい。俺が代わりに覚えておく。", "Keep yours. I'll remember for you.", "Свой держи. Я буду помнить за тебя."), next: "mem3_for", set: { d_key: 3 }, add: { d_trust: 2 } },
  ] },
  mem3_both: { who: "voice", t: L("……二人で。同時に。ロープを両端から放すみたいに。そうすれば、どちらも落ちない。", "……both. at the same time. like letting go of a rope from both ends. that way nobody falls.", "……Вдвоём. Разом. Как отпустить верёвку с обоих концов. Тогда никто не упадёт."), next: "mem3_both2" },
  mem3_both2: { who: "voice", t: L("まだです。でも、あなたが言ってくれたことは覚えておきます。……忘れる話をしているのに、皮肉ですね。", "not yet. but i'll remember you offered. ……ironic, considering.", "Пока нет. Но я запомню, что вы предложили. ……Ирония, если вдуматься."), next: "mem3_end" },
  mem3_keep: { who: "voice", t: L("嫌な部屋も。……あなたはひどい借主になりますね。大家さんには喜ばれる。", "even the bad rooms. ……you'd make a terrible tenant. landlords would adore you.", "Даже плохие. ……Ужасный из вас жилец. Хозяева бы вас обожали."), next: "mem3_end" },
  mem3_for: { who: "voice", t: L("……この扉ごしに言われたなかで、いちばんやさしくて、いちばん重い言葉です。", "……that's the kindest thing anyone's said through this door. and the heaviest.", "……Ничего добрее сквозь эту дверь мне не говорили. И ничего тяжелее."), next: "mem3_end" },
  mem3_end: { who: "voice", t: L("今夜のぶんの家賃は、もういりません。おつりが出るくらいだ。", "no rent tonight. you overpaid.", "Сегодня платы не надо. Вы переплатили."), set: { d_mem: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// FEAR (d_fear 0..2)
// ------------------------------------------------------------------
Object.assign(N, {
  fear1_a: { who: "voice", t: L("自動販売機。", "vending machines.", "Торговых автоматов."), next: "fear1_b" },
  fear1_b: { who: "emrys", emo: "annoyed", t: L("…………。", "…………", "…………"), next: "fear1_c" },
  fear1_c: { who: "voice", t: L("唸っていて、急に止まるでしょう。何かを決めたみたいに。あれが怖い。", "the way they hum and then stop. like they've decided something. that's frightening.", "Гудят, а потом вдруг смолкают. Словно что-то решили. Вот это страшно."), next: "fear1_d" },
  fear1_d: { who: "voice", t: L("それから、四番のベッドの下の暗がり。あれは私のじゃない。", "and the dark under bed four. that one isn't mine.", "И ещё темнота под четвёртой койкой. Та — не моя."), next: "fear1_e" },
  fear1_e: { who: "emrys", emo: "wary", t: L("何が怖い。", "What scares you about it.", "Чем она пугает."), next: "fear1_f" },
  fear1_f: { who: "voice", t: L("待っているんです。誰かが横になるのを。……先生のベッドの下には、何がいますか。", "it's waiting. for someone to lie down. ……and what's under your bed, doctor.", "Она ждёт. Пока кто-нибудь ляжет. ……А что под вашей кроватью, доктор?"), choices: [
    { t: L("患者を失うこと。", "Losing a patient.", "Потерять пациента."), next: "fear1_lose", add: { d_truth: 1 } },
    { t: L("……目が覚めること。", "……Waking up.", "……Проснуться."), next: "fear1_wake", add: { d_truth: 2 } },
    { t: L("コーヒーが切れること。", "Running out of coffee.", "Что кончится кофе."), next: "fear1_coffee", add: { d_refuse: 1, d_trust: 1 } },
  ] },
  fear1_lose: { who: "voice", t: L("毎朝、失っていますよ。あなたはそれを退院と呼ぶ。きれいな言葉です。", "you lose one every dawn. you call it discharge. nice word.", "Вы теряете их каждый рассвет. Называете выпиской. Красивое слово."), next: "fear1_end" },
  fear1_wake: { who: "voice", t: L("……変なものを怖がるんですね。……いえ。変じゃない。", "……that's a strange thing to be afraid of. ……no. it isn't.", "……Странного же вы боитесь. ……Нет. Не странного."), next: "fear1_end" },
  fear1_coffee: { who: "voice", t: L("嘘つき。面白い嘘つきだ。許します。", "liar. a funny liar. i'll allow it.", "Лжец. Забавный лжец. Так и быть."), next: "fear1_end" },
  fear1_end: { who: "voice", t: L("怖いものを言うと、少し小さくなります。今夜は二人ぶん、小さくなった。", "saying a fear out loud makes it a little smaller. tonight two of them shrank.", "Высказанный страх чуть мельчает. Сегодня измельчали два."), set: { d_fear: 1 }, next: "hub" },

  fear2_a: { who: "voice", t: L("出たら、何かになってしまうから。ここにいれば、声だけです。声は、自分の顔を間違えずにすむ。", "because if i come out, i'll be something. in here i'm only a voice. voices can't be wrong about their faces.", "Потому что, выйдя, я стану чем-то. Здесь я только голос. Голос не может ошибиться насчёт своего лица."), next: "fear2_b" },
  fear2_b: { who: "voice", t: L("それに、光が痛いんです。電球のじゃなくて、もうひとつの光。長い廊下の突き当たりにある、あれ。……わかるでしょう。", "and the light hurts. not the bulbs. the other light. the one at the end of a long hallway. ……you know the one.", "И свет режет. Не ламп. Другой свет. Тот, что в конце длинного коридора. ……Вы знаете, о чём я."), next: "fear2_c" },
  fear2_c: { who: "emrys", emo: "think", t: L("非常口の誘導灯か。", "The emergency exit sign.", "Табличка запасного выхода."), next: "fear2_d" },
  fear2_d: { who: "voice", t: L("……ええ。そういうことにしておきましょう。", "……yes. let's say that.", "……Да. Пусть будет так."), choices: [
    { t: L("俺も怖い。", "I'm scared too.", "Мне тоже страшно."), next: "fear2_too", add: { d_truth: 1, d_trust: 1 } },
    { t: L("なら出てこなくていい。大丈夫だ。", "Then stay. It's fine.", "Тогда сиди. Всё нормально."), next: "fear2_fine", add: { d_cold: 1 } },
    { t: L("懐中電灯を持ってる。あんたからは逸らしておく。", "I have a flashlight. I'll point it away from you.", "У меня фонарик. Посвечу в сторону от тебя."), next: "fear2_light", req: "has_flashlight", add: { d_trust: 2 } },
  ] },
  fear2_too: { who: "voice", t: L("もちろん。あなたは字に隠すんです。怖いとき、カルテの字がとてもきれいになる。", "of course you are. you hide it in your handwriting. it gets very neat when you're scared.", "Конечно. Вы прячете это в почерке. Когда вам страшно, он становится очень аккуратным."), next: "fear2_end" },
  fear2_fine: { who: "voice", t: L("大丈夫。あなたが患者に言う言葉ですね。大丈夫じゃないときに。", "it's fine. that's what you tell patients. when it isn't.", "«Нормально». Так вы говорите пациентам. Когда ненормально."), next: "fear2_end" },
  fear2_light: { who: "narr", t: L("懐中電灯の丸い光が、廊下の反対側の壁に落ちる。扉は、暗いままだ。", "The flashlight's circle falls on the far wall of the corridor. The door stays dark.", "Круг фонаря ложится на дальнюю стену коридора. Дверь остаётся в темноте."), next: "fear2_light2" },
  fear2_light2: { who: "voice", t: L("……そういうことをする人なんですね。光を、わざと私から逸らす。あの人も、そうしてくれた。", "……so you're the kind who'd do that. point the light away from me on purpose. he used to do that, too.", "……Вот вы какой. Нарочно отводите свет от меня. Он тоже так делал."), next: "fear2_end" },
  fear2_end: { who: "voice", t: L("今夜は、少しだけ扉の近くにいます。少しだけ。", "tonight i'm sitting a little closer to the door. only a little.", "Сегодня я сижу чуть ближе к двери. Совсем чуть-чуть."), set: { d_fear: 2 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// IDENTITY (d_id 0..3) — sets d_named
// ------------------------------------------------------------------
Object.assign(N, {
  id1_a: { who: "voice", t: L("ここに住んでいる者です。住人。住んでいる、が仕事です。あなたと同じ仕事ですが、照明が悪い。", "the one who lives here. the occupant. i occupy. it's a job, like yours, but with worse lighting.", "Тот, кто здесь живёт. Жилец. Жить — моя работа. Как ваша, только освещение хуже."), set: { d_named: 1 }, next: "id1_b" },
  id1_b: { who: "emrys", emo: "think", t: L("名前は。", "Do you have a name.", "А имя есть."), next: "id1_c" },
  id1_c: { who: "voice", t: L("ありました。人に貸したんです。返ってこなかった。", "i had one. i lent it to someone. never got it back.", "Было. Одолжил кому-то. Так и не вернули."), next: "id1_d" },
  id1_d: { who: "voice", t: L("あなたは誰ですか、先生。", "who are you, doctor.", "А вы кто, доктор?"), choices: [
    { t: L("エムリス・ヘイル。夜勤医。", "Emrys Hale. Night doctor.", "Эмрис Хейл. Ночной врач."), next: "id1_name", add: { d_truth: 1 } },
    { t: L("夜勤のやつだ。", "Just the guy on shift.", "Просто дежурный."), next: "id1_guy", add: { d_refuse: 1 } },
    { t: L("疲れてる誰か。", "Somebody tired.", "Кто-то уставший."), next: "id1_tired", add: { d_trust: 1 } },
  ] },
  id1_name: { who: "voice", t: L("名札を読むみたいな言い方ですね。……名札は、誰にでも書けますよ。", "you said it like you were reading a name tag. ……anyone can write a name tag.", "Сказали так, будто читаете бирку. ……Бирку может надписать кто угодно."), next: "id1_end" },
  id1_guy: { who: "voice", t: L("夜勤のやつ。ええ。建物も、あなたのことをそう呼んでいます。", "the guy on shift. yes. that's what the building calls you too.", "Дежурный. Да. Здание вас так и зовёт."), next: "id1_end" },
  id1_tired: { who: "voice", t: L("ここ何年かで聞いた、いちばん正確な自己紹介です。", "the most accurate introduction i've heard in years.", "Самое точное представление, какое я слышал за годы."), next: "id1_end" },
  id1_end: { who: "voice", t: L("住人と呼んでください。呼ばなくてもいいけど。呼ばれると、少しだけ輪郭ができる。", "call me the occupant. or don't. when someone calls me, i get a bit of an outline.", "Зовите меня Жильцом. Или не зовите. Когда зовут, у меня появляются очертания."), set: { d_id: 1 }, next: "hub" },

  id2_a: { who: "voice", req: "room4_seen", alt: "id2_a_alt", t: L("……カーテンに名札があるでしょう。読みましたね。「E・ヘイル」。よくある名前だ、とあなたは言った。", "……there's a tag on a curtain. you've read it. 'e. hale.' a common name, you said.", "……На занавеске есть бирка. Вы её читали. «Э. Хейл». Распространённая фамилия, сказали вы."), next: "id2_b" },
  id2_a_alt: { who: "voice", t: L("……カーテンの閉まったベッドがあるでしょう。名札、いつか読んでみてください。読まなくても、わかりますけど。", "……there's a bed with its curtain closed. read the tag sometime. or don't. i'd understand.", "……Там есть койка с задёрнутой занавеской. Прочтите как-нибудь бирку. Или не читайте. Я пойму."), next: "id2_b" },
  id2_b: { who: "emrys", emo: "wary", t: L("……それは俺の名前だ。", "……That's my name.", "……Это моё имя."), next: "id2_c" },
  id2_c: { who: "voice", t: L("そうですか。それとも、ベッドから借りてきた名前ですか。", "is it. or did you borrow it from the bed.", "Ваше? Или вы одолжили его у койки?"), choices: [
    { t: L("……ベッドにいるのは、俺だ。", "……I'm the one in the bed.", "……В койке — я."), next: "id2_bed", req: "room4_seen", add: { d_truth: 2 } },
    { t: L("偶然だ。", "Coincidence.", "Совпадение."), next: "id2_coin", add: { d_refuse: 1 } },
    { t: L("じゃあ、あんたは誰なんだ。", "Then who are you.", "Тогда кто ты."), next: "id2_who", add: { d_truth: 1 } },
  ] },
  id2_bed: { who: "voice", t: L("……言ったのは、あなたですよ。私じゃない。私は一度も言っていない。", "……you said it. not me. i never said it.", "……Это сказали вы. Не я. Я ни разу этого не говорил."), next: "id2_end" },
  id2_coin: { who: "voice", t: L("偶然というのは、建物が手を抜いているだけです。", "coincidences are just the building being lazy.", "Совпадения — это просто лень здания."), next: "id2_end" },
  id2_who: { who: "voice", t: L("残りのあなたが横になったとき、起きていた部分かもしれない。前の医者かもしれない。電力を節約するために、あなたの声で話している夜かもしれない。", "maybe the part of you that stayed awake when the rest lay down. maybe the doctor before. maybe the night, talking in your voice to save power.", "Может, часть вас, что не легла, когда легли остальные. Может, прежний врач. Может, ночь — говорит вашим голосом, чтобы сберечь электричество."), next: "id2_end" },
  id2_end: { who: "voice", t: L("……今の、全部ほんとうかもしれないし、全部ちがうかもしれない。両方ということもある。", "……all of that might be true, or none of it. or both. both happens.", "……Всё это может быть правдой. Или ничем. Или и тем и другим. Такое бывает."), set: { d_id: 2 }, next: "hub" },

  id3_a: { who: "voice", t: L("戻ってくる人です。ここでは、それが自分というものです。昔なんだったか、じゃなくて、何に戻ってくるか。", "you're the person who comes back. that's what a self is here. not what you were. what you keep returning to.", "Вы тот, кто возвращается. Здесь это и есть «я». Не кем был. К чему возвращаешься."), next: "id3_b" },
  id3_b: { who: "voice", t: L("患者に戻る。豆に戻る。この扉に戻る。それがあなた。それだけで、ちゃんと一人の人間です。", "you return to the patients. to the bean. to this door. that's you. that's a whole person.", "Вы возвращаетесь к пациентам. К фасолинке. К этой двери. Это вы. Это целый человек."), next: "id3_c" },
  id3_c: { who: "emrys", emo: "ponder", t: L("あんたは。", "And you.", "А ты."), next: "id3_d" },
  id3_d: { who: "voice", t: L("あなたが帰ったあとに残るもの。だから……あなたでもある。少しだけ。行儀の悪い部分。", "what's left when you leave. so — you, too. a bit. the bit with bad manners.", "То, что остаётся, когда вы уходите. Значит, и вы. Немножко. Невоспитанная часть."), choices: [
    { t: L("じゃあ、同じものだ。", "Then we're the same.", "Тогда мы одно и то же."), next: "id3_same", add: { d_truth: 1, d_trust: 1 } },
    { t: L("違う。あんたは、あんただ。", "No. You're you.", "Нет. Ты — это ты."), next: "id3_you", add: { d_trust: 2 } },
    { t: L("俺は、ただの夜勤医だ。", "I'm just the night doctor.", "Я просто ночной врач."), next: "id3_just", add: { d_cold: 1 } },
  ] },
  id3_same: { who: "voice", t: L("半分。半分ずつ。……大きな声で言わないで。建物が聞いている。", "halves. ……don't say it too loudly. the building's listening.", "Половинки. ……Не говорите громко. Здание слушает."), next: "id3_end" },
  id3_you: { who: "voice", t: L("……ありがとう。それが必要だったとは、知りませんでした。", "……thank you. i didn't know i needed that.", "……Спасибо. Я не знал, что мне это нужно."), next: "id3_end" },
  id3_just: { who: "voice", t: L("「ただの」。あなたはその言葉が本当に好きですね。", "'just.' you really love that word.", "«Просто». Как же вы любите это слово."), next: "id3_end" },
  id3_end: { who: "voice", t: L("名前、返してもらわなくていいです。あなたが使っていてください。似合っているから。", "you can keep the name. use it. it suits you.", "Имя можете не возвращать. Носите. Вам идёт."), set: { d_id: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// MEANING (d_mean 0..2)
// ------------------------------------------------------------------
Object.assign(N, {
  mean1_a: { who: "voice", t: L("聞かないと思っていました。いえ、もっと早く聞くと思っていました。", "i thought you'd never ask. no. i thought you'd ask much sooner.", "Думал, вы никогда не спросите. Нет. Думал, спросите гораздо раньше."), next: "mean1_b" },
  mean1_b: { who: "voice", t: L("意味は、プリンです。", "the point is pudding.", "Смысл — в пудинге."), next: "mean1_c" },
  mean1_c: { who: "emrys", emo: "annoyed", t: L("…………。", "…………", "…………"), next: "mean1_d" },
  mean1_d: { who: "voice", t: L("冗談じゃありません。誰かが怖がっていた。あなたがプリンを持っていった。少し怖くなくなった。それで、意味はひとつ完成です。もっと大きいものに足し算しなくていい。", "i'm not joking. someone was afraid. you brought them pudding. they were less afraid. that's a whole point. it doesn't need to add up to a bigger one.", "Я не шучу. Кому-то было страшно. Вы принесли пудинг. Стало чуть менее страшно. Вот и целый смысл. Его не нужно складывать во что-то большее."), choices: [
    { t: L("それで十分だ。", "That's enough for me.", "Мне этого хватит."), next: "mean1_enough", add: { d_trust: 1 } },
    { t: L("何かに積み上がらないと困る。", "It has to add up to something.", "Это должно к чему-то складываться."), next: "mean1_add", add: { d_cold: 1 } },
    { t: L("意味はいらない。八時が欲しい。", "I don't need a point. I need eight o'clock.", "Мне не нужен смысл. Мне нужно восемь утра."), next: "mean1_eight", add: { d_truth: 1 } },
  ] },
  mean1_enough: { who: "voice", t: L("よかった。たいていの聖人も、それで十分なんです。宣伝がうまいだけで。", "good. it's enough for most saints. they just get better press.", "Хорошо. Большинству святых хватает. Просто у них пресса лучше."), next: "mean1_end" },
  mean1_add: { who: "voice", t: L("どうして。誰が計算しているんですか。", "why. who's doing the maths.", "Зачем. Кто ведёт подсчёт?"), next: "mean1_end" },
  mean1_eight: { who: "voice", t: L("ふふ。八時。……来ますよ、そのうち。引き出しだって、いつかは開く。", "ha. eight. ……it'll come, you know. eventually even the drawer opens.", "Ха. Восемь. ……Придёт, знаете. Рано или поздно и ящик открывается."), next: "mean1_end" },
  mean1_end: { who: "voice", t: L("今夜のぶんの意味は、もう済みましたか。……まだなら、豆に何か食べさせてあげて。", "have you done tonight's point yet. ……if not, go feed the bean.", "Сегодняшний смысл уже исполнили? ……Если нет — накормите фасолинку."), set: { d_mean: 1 }, next: "hub" },

  mean2_a: { who: "voice", t: L("……ほとんど覚えていません。暗いのが怖い女の子がいたのは覚えている。暗いのは、部屋が目をつむっているだけだよ、と言った。その子は眠った。", "……i don't remember most of it. i remember a girl who was afraid of the dark. i told her the dark is just the room with its eyes closed. she slept.", "……Почти ничего не помню. Помню девочку, которая боялась темноты. Я сказал ей: темнота — это просто комната закрыла глаза. Она уснула."), next: "mean2_b" },
  mean2_b: { who: "voice", t: L("残っているのはそれだけです。うまくいった一文。残りは全部売ってしまった。", "that's all i kept. one sentence that worked. i sold the rest.", "Только это и осталось. Одна фраза, что сработала. Остальное я продал."), choices: [
    { t: L("いい一文だ。", "That's a good sentence.", "Хорошая фраза."), next: "mean2_good", add: { d_trust: 1 } },
    { t: L("なら、意味はあった。", "Then it meant something.", "Значит, смысл был."), next: "mean2_meant", add: { d_truth: 1 } },
    { t: L("意味のために、ここにいるわけじゃない。", "I'm not here for meaning.", "Я здесь не ради смысла."), next: "mean2_not", add: { d_cold: 1 } },
  ] },
  mean2_good: { who: "voice", t: L("あげます。豆に使ってください。", "you can have it. use it on the bean.", "Дарю. Испробуйте на фасолинке."), next: "mean2_end" },
  mean2_meant: { who: "voice", t: L("かもしれません。一晩ぶんの意味。小さくはない。あなたが生き証人です。……「生き」の部分は、まあ。", "maybe. it meant one night. that isn't small. you're living proof. well. 'living.'", "Может быть. Смысл одной ночи. Это немало. Вы — живое доказательство. Ну. «Живое»."), next: "mean2_end" },
  mean2_not: { who: "voice", t: L("ええ。患者のためでしょう。意味は、勝手についてきたんです。錆みたいに。", "no. you're here for the patients. the meaning came by accident. like rust.", "Да. Вы здесь ради пациентов. Смысл пристал сам. Как ржавчина."), next: "mean2_end" },
  mean2_end: { who: "voice", t: L("部屋が目をつむっているだけ。……いま、扉のこっち側も、目をつむっています。おやすみなさい、とは言いませんよ。", "the room with its eyes closed. ……this side of the door has its eyes closed, too. i won't say good night.", "Комната закрыла глаза. ……И эта сторона двери тоже. «Спокойной ночи» я не скажу."), set: { d_mean: 2 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// DISAPPEARING (d_disap 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  dis1_a: { who: "voice", t: L("二階への階段が、一度消えたことがあります。私はとても動揺した。誰も気づかなかった。", "the stairs to the second floor disappeared once. i was very upset. nobody else noticed.", "Однажды пропала лестница на второй этаж. Я очень расстроился. Больше никто не заметил."), next: "dis1_b" },
  dis1_b: { who: "voice", t: L("物は消えません。見られなくなるだけ。外から見れば、同じことですけど。", "things don't disappear. they stop being looked at. from the outside, it's the same.", "Вещи не исчезают. На них просто перестают смотреть. Снаружи — одно и то же."), choices: [
    { t: L("なら、見ておく。", "Then I'll keep looking.", "Тогда буду смотреть."), next: "dis1_look", add: { d_trust: 1 } },
    { t: L("消えたほうがいいものもある。", "Some things should disappear.", "Кое-что стоило бы и исчезнуть."), next: "dis1_should" },
    { t: L("夜明けの患者みたいに。", "Like the patients at dawn.", "Как пациенты на рассвете."), next: "dis1_dawn", add: { d_truth: 1 } },
  ] },
  dis1_look: { who: "voice", t: L("私を？　あなたには私が見えない。それが抜け道です。私は安全。", "at me? you can't see me. that's the loophole. i'm safe.", "На меня? Вы меня не видите. В этом лазейка. Я в безопасности."), next: "dis1_end" },
  dis1_should: { who: "voice", t: L("たとえば。", "like what.", "Например?"), next: "dis1_should2" },
  dis1_should2: { who: "emrys", emo: "ponder", t: L("……痛み。", "……Pain.", "……Боль."), next: "dis1_should3" },
  dis1_should3: { who: "voice", t: L("痛みは消えません。退院するんです。", "pain doesn't disappear. it gets discharged.", "Боль не исчезает. Её выписывают."), add: { d_truth: 1 }, next: "dis1_end" },
  dis1_dawn: { who: "voice", t: L("ずいぶんはっきり言いましたね。勇敢になってきた。それとも薄くなってきた。ここからだと区別がつかない。", "you said it so plainly. you're getting braver. or thinner. hard to tell from here.", "Как прямо вы сказали. Храбреете. Или истончаетесь. Отсюда не разобрать."), next: "dis1_end" },
  dis1_end: { who: "voice", t: L("……階段は、次の日に戻ってきました。ちょっと段が多かった。十三段。前は十二段でした。", "……the stairs came back the next day. one step too many. thirteen. it used to be twelve.", "……Лестница вернулась на следующий день. С лишней ступенькой. Тринадцать. Было двенадцать."), set: { d_disap: 1 }, next: "hub" },

  dis2_a: { who: "voice", t: L("毎晩、少しずつ。言葉をひとつなくすんです。先週は「かさ」でした。説明するしかなかった。「持ち運べる屋根」。", "a little every night. i lose a word. last week it was 'umbrella'. i had to describe it. 'a roof you carry.'", "Понемногу, каждую ночь. Теряю слово. На прошлой неделе — «зонт». Пришлось описывать: «крыша, которую носят с собой»."), next: "dis2_b" },
  dis2_b: { who: "voice", t: L("あなたが教えてくれた。それでまたなくした。", "you told me the word. i lost it again.", "Вы подсказали слово. Я опять его потерял."), next: "dis2_c" },
  dis2_c: { who: "emrys", emo: "normal", t: L("傘。", "Umbrella.", "Зонт."), next: "dis2_d" },
  dis2_d: { who: "voice", t: L("……ありがとう。ほら、戻った。しばらくは。", "……thank you. there. it's back. for a while.", "……Спасибо. Вот. Вернулось. На время."), choices: [
    { t: L("毎回、教えてやる。", "I'll tell you every time.", "Буду подсказывать каждый раз."), next: "dis2_every", add: { d_trust: 1 } },
    { t: L("書いておけ。", "Write it down.", "Запиши."), next: "dis2_write" },
    { t: L("全部なくしたら、どうなる。", "What happens when you lose them all.", "А что будет, когда потеряешь все."), next: "dis2_all", add: { d_truth: 1 } },
  ] },
  dis2_every: { who: "voice", t: L("疲れますよ。", "you'll get tired.", "Устанете."), next: "dis2_every2" },
  dis2_every2: { who: "emrys", emo: "normal", t: L("もう疲れてる。", "I'm already tired.", "Я уже устал."), next: "dis2_every3" },
  dis2_every3: { who: "voice", t: L("……そうでした。", "……right.", "……И то правда."), next: "dis2_end" },
  dis2_write: { who: "voice", req: "records_seen", alt: "dis2_write_b", t: L("何に。暗がりはインクを吸わない。……でも、あなたは記録室に行きましたね。あそこの紙は、何も忘れない。忘れないって、ちょっと残酷です。", "on what. the dark doesn't take ink. ……but you've been to the records room. the paper there forgets nothing. that's a little cruel.", "На чём. Темнота чернил не держит. ……Но вы бывали в архиве. Бумага там ничего не забывает. Это немного жестоко."), next: "dis2_end" },
  dis2_write_b: { who: "voice", t: L("何に。暗がりはインクを吸わないんです。", "on what. the dark doesn't take ink.", "На чём. Темнота чернил не держит."), next: "dis2_end" },
  dis2_all: { who: "voice", t: L("そうしたら、数えることだけが残ります。一、一、一。悪くないですよ。", "then i'll just be the counting. one, one, one. it's not bad.", "Тогда останется только счёт. Раз, раз, раз. Неплохо, право."), next: "dis2_end" },
  dis2_end: { who: "voice", t: L("今夜なくしたのは……なんだったか。なくしたから、わかりませんね。", "tonight i lost — what was it. well. i lost it, so i can't say.", "Сегодня я потерял… что же. Ну, раз потерял, то и не скажу."), set: { d_disap: 2 }, next: "hub" },

  dis3_a: { who: "voice", t: L("……ある晩、この扉の前を通りすぎて、何かをし忘れた気がするんです。ガスの火を消したか、みたいな。", "……one night you'd walk past this door and feel you'd forgotten something. like whether you turned off the stove.", "……Однажды ночью вы пройдёте мимо этой двери, и вам покажется, что вы что-то забыли. Вроде — выключил ли плиту."), next: "dis3_b" },
  dis3_b: { who: "voice", t: L("戻って確かめる。何もない。それで、ほっとする。それでおしまい。", "you'd go back and check. there'd be nothing. you'd feel better. that's it.", "Вернётесь проверить. Ничего. Станет легче. Вот и всё."), next: "dis3_c" },
  dis3_c: { who: "emrys", emo: "ponder", t: L("……寂しい話だな。", "……That's sad.", "……Грустно."), next: "dis3_d" },
  dis3_d: { who: "voice", t: L("片づいている話です。片づいているのは好きです。", "it's tidy. i like tidy.", "Опрятно. Я люблю опрятность."), choices: [
    { t: L("気づく。", "I'd notice.", "Я замечу."), next: "dis3_notice", add: { d_trust: 2 } },
    { t: L("俺より先に消えるな。", "Don't disappear before me.", "Не исчезай раньше меня."), next: "dis3_before", add: { d_truth: 1, d_trust: 1 } },
    { t: L("みんな消える。それでいい。", "Everyone disappears. Fine.", "Все исчезают. Ну и ладно."), next: "dis3_fine", add: { d_cold: 1 } },
  ] },
  dis3_notice: { who: "voice", t: L("気づくでしょうね。それがあなたの困ったところです。", "you would. that's the trouble with you.", "Заметите. В этом-то с вами и беда."), next: "dis3_end" },
  dis3_before: { who: "voice", t: L("……わがままなお願いですね。引き受けます。", "……that's a selfish request. i accept.", "……Себялюбивая просьба. Принимаю."), next: "dis3_end" },
  dis3_fine: { who: "voice", t: L("「それでいい」。またその言葉。", "'fine.' that word again.", "«Ну и ладно». Опять это слово."), next: "dis3_end" },
  dis3_end: { who: "voice", t: L("傘。……ほら、今日は自分で言えた。", "umbrella. ……see. i said it myself tonight.", "Зонт. ……Видите. Сегодня сам вспомнил."), set: { d_disap: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// ATTACHMENT (d_attach 0..2)
// ------------------------------------------------------------------
Object.assign(N, {
  att1_a: { who: "voice", t: L("足音に、です。あなたのは、左で少しつっかえる。昔、足首を痛めたでしょう。あのつっかえがなくなったら、寂しい。", "to footsteps. yours have a little hitch on the left. you hurt your ankle once. i'd miss the hitch.", "К шагам. В ваших есть заминка на левую. Вы когда-то повредили лодыжку. Мне бы этой заминки не хватало."), next: "att1_b" },
  att1_b: { who: "voice", t: L("情が移るっていうのは、思っていたより長く、誰かを数えてしまうことです。", "attachment is counting someone longer than you meant to.", "Привязанность — это когда считаешь кого-то дольше, чем собирался."), choices: [
    { t: L("ツブには、情が移ってる。", "I'm attached to the bean.", "К фасолинке я привязан."), next: "att1_bean", add: { d_trust: 1 } },
    { t: L("医者は情を移すべきじゃない。", "Doctors shouldn't get attached.", "Врачам нельзя привязываться."), next: "att1_doc", add: { d_cold: 1 } },
    { t: L("……この扉に、かもな。", "……To this door, maybe.", "……К этой двери, может."), next: "att1_door", add: { d_trust: 1, d_truth: 1 } },
  ] },
  att1_bean: { who: "voice", t: L("見ればわかります。誰も聞いていないと思って、あの子に話しかけているでしょう。私はいつも聞いていますよ。", "obviously. you talk to it when you think no one's listening. i'm always listening.", "Это очевидно. Вы с ним разговариваете, когда думаете, что никто не слышит. А я всегда слышу."), next: "att1_end" },
  att1_doc: { who: "voice", t: L("医者はそう言って、死んだ患者のペンを十二年持ち歩くんです。", "doctors say that and then carry a dead patient's pen for twelve years.", "Врачи так говорят, а потом двенадцать лет носят ручку умершего пациента."), next: "att1_end" },
  att1_door: { who: "voice", t: L("……やめておきなさい。扉は抱きしめるのが下手です。", "……don't. doors are bad at hugging.", "……Не стоит. Двери плохо обнимаются."), next: "att1_end" },
  att1_end: { who: "voice", t: L("今夜のあなたの足音、帰りのぶんも数えますね。いつもそうしているけど、言っておきたかった。", "i'll count your steps on the way back too. i always do. i just wanted to say it.", "Ваши шаги на обратном пути я тоже посчитаю. Я всегда считаю. Просто хотел сказать."), set: { d_attach: 1 }, next: "hub" },

  att2_a: { who: "voice", t: L("しがみついているから、夜が終わらないんです。悪いとは言っていませんよ。重いと言っているんです。あなたの手首、とても細いから。", "holding on is why the night doesn't end. i'm not saying it's bad. i'm saying it's heavy. and your wrists are very thin.", "Держатся — потому и ночь не кончается. Я не говорю, что это дурно. Я говорю — тяжело. А запястья у вас очень тонкие."), choices: [
    { t: L("なら、手放す。そのときが来たら。", "Then I'll let go. When it's time.", "Тогда отпущу. Когда придёт время."), next: "att2_let", add: { d_truth: 2 } },
    { t: L("手放さない。", "I'm not letting go.", "Не отпущу."), next: "att2_no", add: { d_cold: 1, d_refuse: 1 } },
    { t: L("あんたは、何にしがみついてる。", "What are you holding on to.", "А ты за что держишься."), next: "att2_you", add: { d_trust: 2 } },
  ] },
  att2_let: { who: "voice", t: L("そのときが来たら。……わかりますよ。窓が教えてくれる。", "when it's time. ……you'll know. the window will tell you.", "Когда придёт время. ……Вы поймёте. Окно подскажет."), next: "att2_end" },
  att2_no: { who: "voice", t: L("ええ、そう思いました。頑固だ。しみみたいに。", "no. i didn't think so. stubborn. like a stain.", "Нет. Так я и думал. Упрямый. Как пятно."), next: "att2_end" },
  att2_you: { who: "voice", t: L("あなたに決まっているでしょう。……変な空気にしないでください。", "you. obviously. don't make it weird.", "За вас, разумеется. ……Не надо неловкости."), next: "att2_end" },
  att2_end: { who: "narr", t: L("扉の向こうで、指先のようなものが、木の内側をひと撫でした。", "On the other side, something like a fingertip traces the wood once, from the inside.", "С той стороны что-то вроде кончика пальца раз проводит по дереву изнутри."), set: { d_attach: 2 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// INEVITABILITY (d_inev 0..2)
// ------------------------------------------------------------------
Object.assign(N, {
  inev1_a: { who: "voice", t: L("全部終わります。この会話を除いて、どうやら。", "everything ends. except this conversation, apparently.", "Всё кончается. Кроме этого разговора, по-видимому."), next: "inev1_b" },
  inev1_b: { who: "voice", t: L("数えました。患者さん、全員。全員が夜明けに出ていった。残った人は一人もいない。職員を除いて。", "i've counted. every patient. every one of them went out at dawn. none stayed. except the staff.", "Я считал. Всех пациентов. Все до единого ушли на рассвете. Никто не остался. Кроме персонала."), next: "inev1_c" },
  inev1_c: { who: "emrys", emo: "wary", t: L("職員は残る。", "Staff stay.", "Персонал остаётся."), next: "inev1_d" },
  inev1_d: { who: "voice", t: L("職員は残る。契約書に書いてあります。小さい字で。三時三十三ポイントの字で。", "staff stay. it's in the contract. the small print. very small. 3:33-point font.", "Персонал остаётся. Так в договоре. Мелким шрифтом. Кеглем три тридцать три."), choices: [
    { t: L("なら、俺も終わる。", "Then I'll end too.", "Значит, и я кончусь."), next: "inev1_end_too", add: { d_truth: 1 } },
    { t: L("今夜じゃない。", "Not tonight.", "Не сегодня."), next: "inev1_not", add: { d_refuse: 1 } },
    { t: L("いいことだ。物事は終わるべきだ。", "Good. Things should end.", "Это хорошо. Всё должно кончаться."), next: "inev1_good", add: { d_truth: 1, d_trust: 1 } },
  ] },
  inev1_end_too: { who: "voice", t: L("ええ。脅しじゃありません。下手に言った、やさしさです。", "yes. that isn't a threat. it's kindness, said badly.", "Да. Это не угроза. Это доброта, неловко высказанная."), next: "inev1_end" },
  inev1_not: { who: "voice", t: L("今夜は、決して。いつも今夜なんですけどね。そこがこつです。", "never tonight. it's always tonight. that's the trick.", "Никогда не сегодня. А сегодня — всегда. В этом фокус."), next: "inev1_end" },
  inev1_good: { who: "voice", t: L("医者の口調で言って、患者の気持ちで思っていますね。", "you say that like a doctor and mean it like a patient.", "Говорите как врач, а чувствуете как пациент."), next: "inev1_end" },
  inev1_end: { who: "voice", t: L("シフトは最後まで務めるんでしょう。……わかっています。", "you'll finish the shift. ……i know.", "Вы доработаете смену. ……Я знаю."), set: { d_inev: 1 }, next: "hub" },

  inev2_a: { who: "voice", t: L("抗うんじゃありません。行く道で、その手を握るんです。それがあなたの仕事。とても上手です。ただ、自分のためには一度もやらない。", "you don't fight it. you hold its hand on the way. that's your job. you're very good at it. you just never do it for yourself.", "С ней не борются. Её держат за руку по дороге. Это ваша работа. Вы в ней мастер. Только для себя — ни разу."), choices: [
    { t: L("……俺の手は、誰が握る。", "……Who'd hold mine.", "……А кто подержит мою."), next: "inev2_who", add: { d_truth: 2, d_trust: 1 } },
    { t: L("誰かが残らなきゃいけない。", "Someone has to stay.", "Кто-то должен остаться."), next: "inev2_stay", add: { d_cold: 2 } },
    { t: L("最後に行きたいだけだ。", "I'd rather go last.", "Я просто хочу уйти последним."), next: "inev2_last", add: { d_refuse: 1, d_truth: 1 } },
  ] },
  inev2_who: { who: "voice", t: L("……もう一度聞いてください。別の夜に。窓が、少し明るい夜に。", "……ask me again. some other night. ask me when the window is lighter.", "……Спросите ещё раз. В другую ночь. Когда окно будет посветлее."), next: "inev2_end" },
  inev2_stay: { who: "voice", t: L("誰か。いつも誰か。", "someone. always someone.", "Кто-то. Всегда кто-то."), next: "inev2_end" },
  inev2_last: { who: "voice", t: L("最後に、じゃなくて、決して、でしょう。違うものですよ。正直に。", "you'd rather go never. that's different. be honest.", "Не последним — никогда. Это разное. Будьте честны."), next: "inev2_end" },
  inev2_end: { who: "voice", t: L("避けられないものは、怖くないんです。避けられるかもしれない、と思っているあいだが怖い。", "the inevitable isn't frightening. it's the 'maybe i can avoid it' part that's frightening.", "Неизбежное не страшно. Страшно, пока думаешь — а вдруг обойдётся."), set: { d_inev: 2 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// THE BORDER (d_border 0..3)
// ------------------------------------------------------------------
Object.assign(N, {
  bor1_a: { who: "voice", t: L("屋上で。それから、この扉で。それから、四番のベッドで。縁は三つ。建物は本当は小さいんです。廊下が多いだけで。", "at the rooftop. and at this door. and at bed four. three edges. the building's very small, really. it just has a lot of hallway.", "На крыше. У этой двери. И у четвёртой койки. Три края. Здание на самом деле маленькое. Просто коридоров много."), next: "bor1_b" },
  bor1_b: { who: "voice", req: "rooftop_seen", alt: "bor1_c", t: L("屋上、行きましたね。空が変わらないのを見たでしょう。ずっと同じ紺色。誰かが塗り忘れたみたいな。", "you've been to the roof. you saw the sky not change. the same navy blue. like someone forgot to finish painting it.", "Вы были на крыше. Видели, что небо не меняется. Всё та же синева. Будто кто-то забыл докрасить."), next: "bor1_c" },
  bor1_c: { who: "emrys", emo: "think", t: L("…………。", "…………", "…………"), choices: [
    { t: L("縁の向こうには、何がある。", "What's past the edges.", "Что за краями."), next: "bor1_past", add: { d_truth: 1 } },
    { t: L("知りたくない。", "I don't want to know.", "Не хочу знать."), next: "bor1_no", add: { d_refuse: 1 } },
    { t: L("この扉も、そのひとつか。", "Is this door one of them.", "И эта дверь — один из них."), next: "bor1_door", add: { d_trust: 1 } },
  ] },
  bor1_past: { who: "voice", t: L("八時です。", "eight o'clock.", "Восемь утра."), next: "bor1_end" },
  bor1_no: { who: "voice", t: L("なら、知らないで。私が代わりに知っておきます。", "then don't. i'll know it for you.", "Тогда не знайте. Я буду знать за вас."), next: "bor1_end" },
  bor1_door: { who: "voice", t: L("ええ。私は敷居です。意見のある玄関マット。", "yes. i'm the threshold. a doormat with opinions.", "Да. Я порог. Коврик у двери, у которого есть мнение."), next: "bor1_end" },
  bor1_end: { who: "voice", t: L("縁というのは、怖いところじゃありません。ただ、そこで靴を脱ぐ決まりになっている。", "edges aren't scary. it's just the custom to take your shoes off there.", "Края не страшны. Просто там принято разуваться."), set: { d_border: 1 }, next: "hub" },

  bor2_a: { who: "voice", t: L("内側。それとも外側。どっちを向くかによります。あなたが私のほうを向いているから、私は向こう側。", "the inside. or the outside. depends which way you're facing. you're facing me, so i'm the far side.", "Внутри. Или снаружи. Зависит, куда смотреть. Вы смотрите на меня — значит, я на той стороне."), next: "bor2_b" },
  bor2_b: { who: "voice", t: L("あなたは手前側ですよ、先生。でも、ぎりぎり。かかとが線の上にある。", "you're on the near side, doctor. but only just. your heels are on the line.", "Вы на ближней стороне, доктор. Но еле-еле. Пятки на черте."), next: "bor2_c" },
  bor2_c: { who: "narr", t: L("エムリスは足もとを見る。床に、かすかな光の線がある。いつからか、彼はずっとその上に立っていた。", "Emrys looks down. There is a faint line of light on the floor. He has been standing on it for some time.", "Эмрис смотрит вниз. На полу — слабая полоска света. Он стоит на ней уже давно."), choices: [
    { t: L("一歩下がる。", "Step back.", "Отступить."), next: "bor2_back", add: { d_refuse: 1 } },
    { t: L("線の上に立ったままでいる。", "Stay on the line.", "Остаться на черте."), next: "bor2_stay", add: { d_truth: 1, d_trust: 1 } },
    { t: L("一歩、前へ。", "Step forward.", "Шагнуть вперёд."), next: "bor2_fwd", add: { d_truth: 1 } },
  ] },
  bor2_back: { who: "voice", t: L("よし。まだです。", "good. not yet.", "Хорошо. Ещё рано."), next: "bor2_end" },
  bor2_stay: { who: "voice", t: L("……落ち着いていますね。悟りか、貧血か、どちらかだ。", "……you're very calm. that's either wisdom or anemia.", "……Вы очень спокойны. Это либо мудрость, либо малокровие."), next: "bor2_end" },
  bor2_fwd: { who: "voice", t: L("だめ。……だめです。そんなふうに、目をつむったままじゃ。戻って。", "no. —no. not like that. not with your eyes closed. come back.", "Нет. — Нет. Не так. Не с закрытыми глазами. Вернитесь."), next: "bor2_fwd2" },
  bor2_fwd2: { who: "narr", t: L("冷たさが、そっと、すねのあたりを押し返した。", "The cold pushes back, very gently, against his shins.", "Холод мягко отталкивает его, упираясь в голени."), next: "bor2_end" },
  bor2_end: { who: "voice", t: L("線のことは、誰にも言わないで。豆にも。あの子は線の上で跳ねたがるから。", "don't tell anyone about the line. not even the bean. it'd want to bounce on it.", "О черте никому. Даже фасолинке. Ей захочется на ней попрыгать."), set: { d_border: 2 }, next: "hub" },

  bor3_a: { who: "voice", t: L("数えるのをやめます。それだけ。私にとっては、それがいちばん大きな変化。あなたにとっては……呼び出しの音に耳を澄ますのを、やめる。", "they stop counting. that's all. for me that'd be the biggest change. for you — you'd stop listening for alarms.", "Перестают считать. Только и всего. Для меня это была бы величайшая перемена. Для вас — вы перестанете прислушиваться к вызовам."), next: "bor3_b" },
  bor3_b: { who: "voice", t: L("向こうは暗くないんです。それが冗談なんですよ。暗いのはこっち側。私がここに座っているのは、あなたが座らなくてすむように。", "it isn't dark. that's the joke. the dark is on this side. i'm sitting in it so you don't have to.", "Там не темно. В том-то и шутка. Темно — по эту сторону. Я сижу в ней, чтобы не пришлось сидеть вам."), next: "bor3_c" },
  bor3_c: { who: "emrys", emo: "ponder", t: L("……俺のぶんを、預かってたのか。", "……You've been keeping it for me.", "……Ты держал её за меня."), next: "bor3_d" },
  bor3_d: { who: "voice", t: L("誰かがやらないと。あなたは忙しかった。", "someone had to. you were busy.", "Кто-то должен был. Вы были заняты."), choices: [
    { t: L("……ありがとう。", "……Thank you.", "……Спасибо."), next: "bor3_thanks", add: { d_trust: 2 } },
    { t: L("返せ。それは俺のだ。", "Give it back. It's mine.", "Верни. Она моя."), next: "bor3_give", add: { d_truth: 2 } },
    { t: L("越えない。絶対に。", "I'm not crossing. Ever.", "Я не перейду. Никогда."), next: "bor3_never", add: { d_cold: 2, d_refuse: 1 } },
  ] },
  bor3_thanks: { who: "voice", t: L("やめて。……わかりました。どういたしまして。数えておきます。", "don't. ……fine. you're welcome. i'll count it.", "Не надо. ……Ладно. Не за что. Я посчитаю."), next: "bor3_end" },
  bor3_give: { who: "voice", t: L("……まだです。両方を持つ準備は、まだできていない。でも、近づいている。", "……not yet. you're not ready to carry both. but you're closer.", "……Пока нет. Вы ещё не готовы нести обе. Но ближе."), next: "bor3_end" },
  bor3_never: { who: "voice", t: L("「絶対」は、長い勤務ですよ。", "ever is a long shift.", "«Никогда» — долгая смена."), next: "bor3_end" },
  bor3_end: { who: "voice", t: L("今夜の線は、昨日より少し太い。気のせいかな。気のせいということにしましょう。", "the line is a little wider tonight than yesterday. or i imagine it. let's say i imagine it.", "Черта сегодня чуть шире вчерашней. Или мне мерещится. Пусть мерещится."), set: { d_border: 3 }, add: { d_finals: 1 }, next: "hub" },
});

// ------------------------------------------------------------------
// ENDING ROUTES
// ------------------------------------------------------------------
Object.assign(N, {
  // DAWN
  dawn_a: { who: "voice", t: L("……気づきましたか。", "……you noticed.", "……Заметили."), next: "dawn_b" },
  dawn_b: { who: "voice", t: L("屋上に行ってから。名札を読んでから。ずっと、少しずつ明るいんです。", "since you went to the roof. since you read the tag. it's been getting lighter. a little at a time.", "С тех пор как вы поднялись на крышу. Как прочли бирку. Светлеет. Понемногу."), next: "dawn_c" },
  dawn_c: { who: "emrys", emo: "think", t: L("時計は。", "The clocks.", "А часы."), next: "dawn_d" },
  dawn_d: { who: "voice", t: L("まだ三時三十三分。時計はいつも最後に知るんです。", "still 3:33. they'll be the last to know. clocks always are.", "Всё ещё три тридцать три. Они узнают последними. Часы всегда последние."), next: "dawn_e" },
  dawn_e: { who: "voice", req: "d_inev>=2", alt: "dawn_f", t: L("前に聞きましたね。俺の手は誰が握るのか、って。窓が明るい夜にもう一度聞いて、と私は言った。……明るいですよ。", "you asked me once who would hold yours. i said ask again when the window is lighter. ……it's lighter.", "Вы как-то спросили, кто подержит вашу руку. Я сказал: спросите, когда окно посветлеет. ……Посветлело."), next: "dawn_f" },
  dawn_f: { who: "emrys", emo: "ponder", t: L("……患者は。", "……The patients.", "……Пациенты."), next: "dawn_g" },
  dawn_g: { who: "voice", t: L("退院しました。全員。あなたが退院させた。ひとり残らず。最後の一人を除いて。", "discharged. all of them. you did that. every single one. except the last.", "Выписаны. Все. Это сделали вы. Каждого. Кроме последнего."), next: "dawn_h" },
  dawn_h: { who: "voice", t: L("シフトは最後まで務める。私はずっとそう言ってきましたね。どっち向きに、とは一度も言わなかった。", "you'll finish the shift. that's what i always said. i never said which way.", "Вы доработаете смену. Я всегда так говорил. Ни разу не сказал — в какую сторону."), choices: [
    { t: L("……わかった。", "……Okay.", "……Ладно."), next: "dawn_i" },
    { t: L("まだだ。", "Not yet.", "Ещё нет."), next: "dawn_not", add: { d_refuse: 1 } },
  ] },
  dawn_not: { who: "voice", t: L("まだ。ええ。窓は待ってくれます。窓は気が長い。……私ほどじゃないけど。", "not yet. yes. the window will wait. windows are patient. ……not as patient as me.", "Ещё нет. Да. Окно подождёт. Окна терпеливы. ……Не так, как я."), next: "hub" },
  dawn_i: { who: "voice", t: L("……「わかった」。最初の夜も、受付でそう言いましたね。誰もいないのに。", "……'okay.' that's what you said in reception, the first night. to nobody.", "……«Ладно». Так вы сказали в регистратуре, в первую ночь. В пустоту."), next: "dawn_j" },
  dawn_j: { who: "emrys", emo: "normal", t: L("誰もいなかったわけじゃない。", "It wasn't nobody.", "Не в пустоту."), next: "dawn_k" },
  dawn_k: { who: "narr", t: L("扉の下の隙間から、暗がりではなく、淡い光がこぼれてくる。", "From the gap beneath the door, not darkness but a pale light spills out.", "Из щели под дверью льётся не темнота, а бледный свет."), ending: "dawn" },

  // SHIFT
  shift_a: { who: "voice", t: L("……知っています。", "……i know.", "……Знаю."), next: "shift_b" },
  shift_b: { who: "voice", t: L("あなたはいつも最後まで務める。ただ、シフトのほうが、あなたを最後まで務めさせてくれないだけで。", "you always finish the shift. the shift just never finishes you.", "Вы всегда дорабатываете смену. Только смена вас никак не доработает."), next: "shift_c" },
  shift_c: { who: "emrys", emo: "crossed", t: L("誰かがここにいなきゃいけない。", "Someone has to be here.", "Кто-то должен быть здесь."), next: "shift_d" },
  shift_d: { who: "voice", t: L("ええ。誰か。……それなら、ひとつ渡しておきたいものがあります。数えることです。この先、必要になるから。", "yes. someone. ……then let me give you something. the counting. you'll need it.", "Да. Кто-то. ……Тогда позвольте кое-что вам передать. Счёт. Он вам понадобится."), choices: [
    { t: L("残る。", "I'm staying.", "Я остаюсь."), next: "shift_e" },
    { t: L("……待て。こういうのじゃない。", "……Wait. Not like this.", "……Подожди. Не так."), next: "shift_wait", add: { d_cold: -2, d_refuse: -2, d_truth: 1 } },
  ] },
  shift_wait: { who: "voice", t: L("……よかった。正直、ほっとしました。今の、聞かなかったことにします。", "……good. honestly, i'm relieved. i'll pretend i didn't hear it.", "……Хорошо. Честно — отлегло. Сделаю вид, что не слышал."), next: "hub" },
  shift_e: { who: "voice", t: L("一、一、一。……ほら。もうあなたのものだ。", "one, one, one. ……there. it's yours now.", "Раз, раз, раз. ……Вот. Теперь это ваше."), next: "shift_f" },
  shift_f: { who: "narr", t: L("受付のほうで、時計の秒針が一度だけ震えて、また止まった。", "Down at reception, the clock's second hand trembles once, and stops again.", "В регистратуре секундная стрелка один раз вздрагивает — и снова замирает."), ending: "shift" },

  // FORGET
  fgt_a: { who: "voice", t: L("記録室に行きましたね。あなたの字のカルテが、全部同じ夜の日付で、棚いっぱいに並んでいた。", "you went to the records room. you saw shelves full of charts in your handwriting, all dated the same night.", "Вы ходили в архив. Видели полки, полные карт вашим почерком. И все — одной и той же ночью."), next: "fgt_b" },
  fgt_b: { who: "voice", t: L("それで、手のひらを開いてここに来た。", "and you came here with your hand open.", "И пришли сюда с раскрытой ладонью."), next: "fgt_c" },
  fgt_c: { who: "emrys", emo: "normal", t: L("二人で、同時に。そう言っただろ。", "Both of us. At the same time. That's what we said.", "Оба. Одновременно. Так мы договорились."), next: "fgt_d" },
  fgt_d: { who: "voice", t: L("ロープを両端から放すみたいに。……覚えていてくれた。これから忘れるのに。", "like letting go of a rope from both ends. ……you remembered. right before forgetting.", "Как отпустить верёвку с обоих концов. ……Вы запомнили. Как раз перед тем, как забыть."), choices: [
    { t: L("三つ数えて。", "On three.", "На счёт три."), next: "fgt_e" },
    { t: L("……まだだ。", "……Not yet.", "……Ещё нет."), next: "fgt_not", add: { d_trust: 1 } },
  ] },
  fgt_not: { who: "voice", t: L("ええ。部屋は、もう少し借りていていい。家賃は、私が少し出しておきます。", "yes. you can rent the room a little longer. i'll cover some of the rent.", "Да. Можно снимать комнату ещё немного. Часть платы я внесу."), next: "hub" },
  fgt_e: { who: "voice", t: L("一。", "one.", "Раз."), next: "fgt_f" },
  fgt_f: { who: "emrys", emo: "ponder", t: L("二。", "Two.", "Два."), next: "fgt_g" },
  fgt_g: { who: "voice", t: L("……三。", "……three.", "……Три."), next: "fgt_h" },
  fgt_h: { who: "narr", t: L("隙間の下に、小さな鍵がひとつ、すべり出てきた。エムリスの手の中にも、いつのまにか鍵がひとつあった。", "A small key slides out from under the door. And in Emrys's hand, without his noticing when, there is a key as well.", "Из-под двери выскальзывает маленький ключ. И у Эмриса в руке, сам не заметил когда, тоже ключ."), ending: "forget" },

  // TSUBU
  tse_a: { who: "tsubu", req: "tsubu_bond>=8", alt: "tse_a_alt", t: L("ツブね！　ドアさんに！　いいたいこと、あるの！", "TSUBU HAS! SOMETHING! TO SAY! TO THE DOOR!", "ЦУБУ ХОЧЕТ! СКАЗАТЬ! ДВЕРИ!"), next: "tse_b" },
  tse_a_alt: { who: "narr", t: L("白衣のポケットで、瓶が激しく鳴っている。", "In his coat pocket, the bottle is rattling hard.", "В кармане халата отчаянно гремит склянка."), next: "tse_b" },
  tse_b: { who: "voice", t: L("……こんばんは、小さいの。", "……hello, little one.", "……Здравствуй, малыш."), next: "tse_c" },
  tse_c: { who: "tsubu", req: "tsubu_bond>=8", alt: "tse_c_alt", t: L("ツブ、まどべ、おぼえてる！　ツブ、むかし、からからだった！　しゃべれなかった！", "TSUBU REMEMBERS THE WINDOWSILL! TSUBU WAS RATTLY! TSUBU COULDN'T TALK!", "ЦУБУ ПОМНИТ ПОДОКОННИК! ЦУБУ ГРЕМЕЛ! ЦУБУ НЕ УМЕЛ ГОВОРИТЬ!"), next: "tse_d" },
  tse_c_alt: { who: "narr", t: L("瓶の音が、まるで言葉の形をしている。", "The rattling almost has the shape of words.", "Звон склянки почти складывается в слова."), next: "tse_d" },
  tse_d: { who: "tsubu", req: "tsubu_bond>=8", alt: "tse_d_alt", t: L("でも、エムリスがさびしそうだったから。ツブ、がんばって、しゃべれるようになったの。ひとりにしないように。", "BUT EMRYS LOOKED SAD. SO TSUBU TRIED REALLY HARD. AND TSUBU STARTED TALKING. SO EMRYS WOULDN'T BE ALONE.", "НО ЭМРИС БЫЛ ГРУСТНЫЙ. И ЦУБУ ОЧЕНЬ СТАРАЛСЯ. И ЗАГОВОРИЛ. ЧТОБЫ ЭМРИС БЫЛ НЕ ОДИН."), next: "tse_e" },
  tse_d_alt: { who: "voice", t: L("……ええ。この子は、あなたが一人にならないように、しゃべるのを覚えたんです。", "……yes. it learned to talk so you wouldn't be alone.", "……Да. Он научился говорить, чтобы вы не были одни."), next: "tse_e" },
  tse_e: { who: "emrys", emo: "ponder", t: L("…………ツブ。", "…………Tsubu.", "…………Цубу."), next: "tse_f" },
  tse_f: { who: "voice", t: L("それで、何を言いたいんですか。", "and what did you want to say.", "И что же ты хотел сказать?"), next: "tse_g" },
  tse_g: { who: "tsubu", req: "tsubu_bond>=8", alt: "tse_g_alt", t: L("ツブ、さきに、あさ、みてくる！　あさにプリンあるか、しらべる！　あったかいか、しらべる！　そしたらエムリス、こわくないでしょ！", "TSUBU WILL GO LOOK AT MORNING FIRST! TSUBU WILL CHECK IF MORNING HAS PUDDING! AND IF IT'S WARM! THEN EMRYS WON'T BE SCARED!", "ЦУБУ СХОДИТ ПОСМОТРИТ УТРО ПЕРВЫМ! ПРОВЕРИТ, ЕСТЬ ЛИ ТАМ ПУДИНГ! И ТЕПЛО ЛИ! ТОГДА ЭМРИСУ БУДЕТ НЕ СТРАШНО!"), next: "tse_h" },
  tse_g_alt: { who: "voice", t: L("……先に朝を見てくる、と言っています。プリンがあるか、暖かいか。あなたが怖くないように。", "……it says it'll go see the morning first. whether there's pudding. whether it's warm. so you won't be scared.", "……Говорит, сходит первым посмотреть утро. Есть ли там пудинг. Тепло ли. Чтобы вам было не страшно."), next: "tse_h" },
  tse_h: { who: "voice", t: L("この隙間は、豆ひとつぶんなら通れます。……どうしますか、先生。", "the gap under the door is just wide enough for one bean. ……what will you do, doctor.", "Щель под дверью как раз на одну фасолинку. ……Как поступите, доктор?"), choices: [
    { t: L("……行ってこい。", "……Go on, then.", "……Иди."), next: "tse_i" },
    { t: L("だめだ。ここにいろ。", "No. Stay with me.", "Нет. Останься со мной."), next: "tse_no", add: { d_trust: 1 } },
  ] },
  tse_no: { who: "voice", req: "tsubu_bond>=8", alt: "tse_no_b", t: L("……ですって。小さいの、よかったですね。", "……you heard him, little one. lucky you.", "……Слышал, малыш? Повезло тебе."), next: "tse_no_t" },
  tse_no_t: { who: "tsubu", req: "tsubu_bond>=8", alt: "tse_no_b", t: L("じゃあ、ツブ、いる！　ずっといる！　おなかすいた！", "THEN TSUBU STAYS! TSUBU STAYS FOREVER! TSUBU IS HUNGRY!", "ТОГДА ЦУБУ ОСТАЁТСЯ! НАВСЕГДА! ЦУБУ ГОЛОДЕН!"), next: "hub" },
  tse_no_b: { who: "voice", t: L("……瓶の音が、安心したみたいに静かになりました。", "……the rattling has gone quiet. relieved, it seems.", "……Склянка затихла. Словно с облегчением."), next: "hub" },
  tse_i: { who: "narr", t: L("エムリスは瓶の蓋を開け、扉の前の床にそっと傾けた。白い小さな粒が、光の線の上をころがっていく。", "Emrys unscrews the lid and tilts the bottle gently toward the floor. A small white bean rolls out along the line of light.", "Эмрис откручивает крышку и бережно наклоняет склянку к полу. Маленькая белая фасолинка катится по полоске света."), ending: "tsubu" },

  // BOTH
  both_a: { who: "voice", t: L("……開けてほしい、ですか。", "……you want me to open it.", "……Вы хотите, чтобы я открыл."), next: "both_b" },
  both_b: { who: "voice", t: L("この扉は、こっちからは開きません。最初から開いたことがない。開くのは、真ん中からです。", "it doesn't open from this side. it never did. it opens from the middle.", "С этой стороны она не открывается. И никогда не открывалась. Она открывается с середины."), next: "both_c" },
  both_c: { who: "emrys", emo: "think", t: L("真ん中。", "The middle.", "С середины."), next: "both_d" },
  both_d: { who: "voice", t: L("線の上。あなたが半歩、私が半歩。……私、半歩ぶんの足があるかどうか、わかりませんけど。", "the line. half a step from you, half a step from me. ……i'm not sure i have half a step's worth of feet.", "На черте. Полшага вы, полшага я. ……Не уверен, найдётся ли у меня ног на полшага."), next: "both_e" },
  both_e: { who: "voice", t: L("時間のこと、死のこと、部屋と鍵のこと、線のこと。全部話しました。数えたら、ちょうど足りている。", "time. death. rooms and keys. the line. we've talked through all of it. i counted. it's exactly enough.", "О времени. О смерти. О комнатах и ключах. О черте. Обо всём переговорили. Я сосчитал. Ровно столько, сколько нужно."), choices: [
    { t: L("半分ずつだ。", "Halfway, then.", "Тогда — по полпути."), next: "both_f" },
    { t: L("……今夜じゃない。", "……Not tonight.", "……Не сегодня."), next: "both_not" },
  ] },
  both_not: { who: "voice", t: L("今夜じゃない。……いつも今夜なんですけどね。いいです。扉はここにある。私もここにいる。", "not tonight. ……it's always tonight, though. fine. the door is here. so am i.", "Не сегодня. ……Хотя сегодня — всегда. Ладно. Дверь здесь. И я здесь."), next: "hub" },
  both_f: { who: "narr", t: L("エムリスは手のひらを扉に当てる。木の向こう側から、同じ高さに、同じ大きさの冷たさが当たる。", "Emrys lays his palm flat on the door. From the other side of the wood, at the same height, a cold of exactly the same size presses back.", "Эмрис прикладывает ладонь к двери. С той стороны дерева, на той же высоте, отвечает холод точно такой же величины."), next: "both_g" },
  both_g: { who: "voice", t: L("……ああ。あなたの手、こんなに温かかったんですね。", "……oh. your hand was this warm.", "……О. Ваша рука была такая тёплая."), next: "both_h" },
  both_h: { who: "emrys", emo: "normal", t: L("あんたのは、思ったより俺のに似てる。", "Yours is more like mine than I thought.", "Твоя больше похожа на мою, чем я думал."), next: "both_i" },
  both_i: { who: "narr", t: L("取っ手のない扉が、内側でも外側でもない方向に、音もなく開いた。", "The handleless door opens without a sound, in a direction that is neither in nor out.", "Дверь без ручки бесшумно открывается — в сторону, что не внутрь и не наружу."), ending: "both" },
});

// ------------------------------------------------------------------
// ENDINGS
// ------------------------------------------------------------------
const ENDINGS = {
  dawn: {
    title: L("夜明け", "Dawn", "Рассвет"),
    text: [
      L("扉の下からこぼれた光は、廊下を這い、受付の床を渡り、正面玄関のガラスに届いた。", "The light from under the door crept down the corridor, crossed the reception floor, and reached the glass of the front entrance.", "Свет из-под двери пополз по коридору, пересёк пол регистратуры и добрался до стекла парадного входа."),
      L("エムリスは白衣を脱いで、たたんで、受付の椅子の背にかけた。誰かが次に着るかもしれない。着ないかもしれない。どちらでもいいように、きちんとたたんだ。", "Emrys took off his coat, folded it, and hung it over the back of the reception chair. Someone might wear it next. Someone might not. He folded it neatly, so either would be fine.", "Эмрис снял халат, сложил его и повесил на спинку стула в регистратуре. Может, его кто-нибудь наденет. Может, нет. Он сложил его аккуратно, чтобы годилось и так, и так."),
      L("胸ポケットのペンは、一本だけ持っていくことにした。どの患者のものだったか、もう思い出せないペンだった。", "He decided to take one pen from the chest pocket. He could no longer remember which patient it had belonged to.", "Из нагрудного кармана он решил взять одну ручку. Чья она была, какого пациента, он уже не помнил."),
      L("四番のベッドのカーテンは、開けなかった。開けなくても、中が空っぽなのはわかっていた。今、空っぽになったのだ。", "He did not open the curtain on Bed 4. He knew without opening it that it was empty. It had just become empty.", "Занавеску у четвёртой койки он не открыл. Он и так знал, что там пусто. Только что стало пусто."),
      L("受付の時計の長針が、かすかな音を立てて、ひとつ進んだ。三時三十四分。何も起きなかった。起きなかったことが、起きた。", "The minute hand of the reception clock moved forward one notch with a faint sound. 3:34. Nothing happened. And that nothing was what happened.", "Минутная стрелка часов в регистратуре с тихим щелчком сдвинулась на деление. Три тридцать четыре. Ничего не случилось. Это «ничего» и случилось."),
      L("背中のほうで、あの声がした。「何時ですか」", "Behind him, the voice. 'what time is it.'", "За спиной — тот голос. «Который час?»"),
      L("エムリスは腕時計を見なかった。「朝だ」とだけ言った。", "Emrys didn't look at his watch. 'Morning,' was all he said.", "Эмрис не взглянул на часы. «Утро», — только и сказал он."),
      L("「……そうですか。そうでしょうね」　声は、少し笑っているように聞こえた。「シフト、お疲れさまでした」", "'……yes. it would be.' The voice sounded as though it were smiling, a little. 'good work on the shift.'", "«……Вот как. Разумеется». Голос, кажется, чуть улыбался. «Благодарю за смену»."),
      L("ガラス戸を押すと、外は思っていたより寒くて、思っていたより明るかった。洗濯物と、遠い車と、誰かが朝ごはんを焦がした匂いがした。", "When he pushed the glass door, it was colder outside than he'd expected, and brighter. It smelled of laundry, distant cars, and someone burning breakfast.", "Он толкнул стеклянную дверь. Снаружи было холоднее, чем он думал, и светлее. Пахло бельём, далёкими машинами и чьим-то пережаренным завтраком."),
      L("八時までは、まだ少しある。でも、引き継ぎはもう済んでいる気がした。", "There was still a little while until eight. But he had the feeling the handover was already done.", "До восьми оставалось ещё немного. Но ему казалось, что пересменка уже состоялась."),
    ],
  },
  shift: {
    title: L("終わらない勤務", "The Shift", "Бессменная смена"),
    text: [
      L("その夜から、エムリスは扉の前を素通りしなくなった。かといって、話しかけることもなくなった。", "From that night on, Emrys no longer walked past the door without stopping. But he no longer spoke to it, either.", "С той ночи Эмрис больше не проходил мимо двери просто так. Но и заговаривать с ней перестал."),
      L("彼は数えるようになった。廊下の歩数。点滴の滴。患者の寝息。一、一、一。横向きに。", "He began to count. Steps down the corridor. Drops from an IV. A patient's breathing in sleep. One, one, one. Sideways.", "Он начал считать. Шаги по коридору. Капли капельницы. Дыхание спящего пациента. Раз, раз, раз. Вбок."),
      L("患者は来て、怖がって、プリンを食べて、少し怖くなくなって、夜明けに退院していった。エムリスはひとり残らず見送った。", "Patients came, were afraid, ate pudding, were a little less afraid, and were discharged at dawn. Emrys saw every one of them off.", "Пациенты приходили, боялись, ели пудинг, боялись чуть меньше и на рассвете выписывались. Эмрис провожал каждого."),
      L("夜明けは、彼のためには来なかった。彼はそれを、とくに不公平だとは思わなかった。勤務表にそう書いてあったのだから。", "Dawn never came for him. He didn't think it was especially unfair. It was what the rota said.", "Рассвет для него не наступал. Он не считал это особой несправедливостью. Так значилось в графике."),
      L("コーヒーは、いつまでも置いたときの温度のままだった。彼はそれを、便利だと思うことにした。", "The coffee stayed forever at the temperature he'd left it. He decided to consider that convenient.", "Кофе навсегда оставался той температуры, какой он его оставил. Он решил считать это удобством."),
      L("ある夜、扉の前に立つと、向こうから声はしなかった。ただ、暗がりが少しだけ左に寄っていた。お気に入りの場所を、彼に譲るみたいに。", "One night, when he stood before the door, no voice came. Only the dark had shifted a little to the left. As if it were giving up its favorite spot for him.", "Однажды ночью он встал у двери, и голоса не было. Лишь темнота немного сдвинулась влево. Будто уступала ему своё любимое место."),
      L("彼はそこに立った。冷たさは、思っていたよりやさしかった。", "He stood there. The cold was gentler than he'd expected.", "Он встал туда. Холод был мягче, чем он думал."),
      L("受付の時計は三時三十三分を指している。新しく来た患者が、おずおずと聞いた。「いま、何時ですか」", "The reception clock reads 3:33. A new patient asks, hesitantly: 'What time is it?'", "Часы в регистратуре показывают три тридцать три. Новый пациент робко спрашивает: «Который час?»"),
      L("「三時三十三分」とエムリスは答えた。それから少し考えて、つけ足した。「大丈夫。最後までいる」", "'Three thirty-three,' Emrys answers. Then, after a moment, he adds: 'It's all right. I'll be here till the end.'", "«Три тридцать три», — отвечает Эмрис. Потом, подумав, добавляет: «Ничего. Я буду здесь до конца»."),
      L("その言葉が嘘ではないことを、建物じゅうが知っていた。", "The whole building knew that wasn't a lie.", "Всё здание знало, что это не ложь."),
    ],
  },
  forget: {
    title: L("鍵を返す", "Returning the Key", "Вернуть ключ"),
    text: [
      L("鍵を返すというのは、思っていたより静かなことだった。", "Returning a key turned out to be quieter than he'd imagined.", "Вернуть ключ оказалось тише, чем он думал."),
      L("大家さんは礼儀正しかった。家具を一つずつ運び出し、窓のひびの入ったガラスだけは、最後まで丁寧に扱った。「E」の字の形のひび。", "The landlord was polite. He carried the furniture out piece by piece, and handled the cracked window most carefully of all, to the very end. A crack shaped like the letter E.", "Хозяин был учтив. Выносил мебель по одной вещи, и дольше всех, бережнее всех, обращался с треснувшим окном. С трещиной в форме буквы «Э»."),
      L("受付の椅子。冷めないコーヒー。四番のベッドの名札。スリッパの向き。百二歩。三十八歩。火曜日という言葉。", "The reception chair. The coffee that never cooled. The tag on Bed 4. Which way the slippers pointed. A hundred and two steps. Thirty-eight steps. The word Tuesday.", "Стул в регистратуре. Неостывающий кофе. Бирка у четвёртой койки. Куда смотрели тапочки. Сто два шага. Тридцать восемь шагов. Слово «вторник»."),
      L("運び出されるたびに、部屋は少し明るくなった。物がなくなると、窓からの光が床まで届くようになるのだ。", "Each time something was carried out, the room grew a little brighter. With fewer things in the way, the light from the window reached the floor.", "С каждой вынесенной вещью в комнате становилось чуть светлее. Когда вещей меньше, свет из окна достаёт до пола."),
      L("扉の向こうでも、同じことが起きていた。ロープは両端から同時に放されて、どちらも落ちなかった。", "The same thing was happening on the other side of the door. The rope was released from both ends at once, and neither of them fell.", "По ту сторону двери происходило то же самое. Верёвку отпустили с обоих концов разом, и никто не упал."),
      L("最後に残ったのは、形だった。ペンの持ち方。誰かの隣に、何も言わずに椅子を引いて座る、あの癖。", "What remained at the end was a shape. The way he held a pen. That habit of pulling up a chair beside someone and sitting without a word.", "Под конец остались очертания. То, как он держал ручку. Та привычка — придвинуть стул к кому-нибудь и сесть молча."),
      L("疲れは、一緒に出ていった。それがいちばんよかった、と誰かが言った。誰が言ったのかは、もうわからない。", "The tiredness went out with everything else. That was the best part, someone said. He could no longer tell who.", "Усталость ушла вместе со всем. Это и было лучшим, сказал кто-то. Кто — уже не разобрать."),
      L("目を開けると、黒い扉の前に立っていた。取っ手はない。隙間から、冷たい暗がりがにじんでいる。", "When he opened his eyes, he was standing in front of a black door. No handle. Cold darkness seeped from the gap.", "Открыв глаза, он стоял перед чёрной дверью. Без ручки. Из щели сочилась холодная темнота."),
      L("「……はじめまして」と、向こうから声がした。「いま、何時ですか」", "'……nice to meet you,' said a voice from the other side. 'what time is it.'", "«……Очень приятно», — сказал голос с той стороны. «Который час?»"),
      L("エムリスは腕時計を見て、なぜか、少しだけ笑った。", "Emrys looked at his watch and, for some reason, smiled a little.", "Эмрис взглянул на часы и почему-то чуть улыбнулся."),
    ],
  },
  tsubu: {
    title: L("ひとつぶ", "One Bean", "Одна фасолинка"),
    text: [
      L("白い粒は光の線の上をころがって、扉の隙間に吸いこまれる直前で、一度だけ止まった。", "The white bean rolled along the line of light, and just before slipping into the gap, it stopped once.", "Белая фасолинка катилась по полоске света и перед самой щелью один раз остановилась."),
      L("「エムリス、ちゃんとごはんたべてね！　ツブ、かぞえてるからね！」", "'EMRYS, EAT YOUR FOOD PROPERLY! TSUBU IS COUNTING!'", "«ЭМРИС, ЕШЬ КАК СЛЕДУЕТ! ЦУБУ СЧИТАЕТ!»"),
      L("それから、いつもの大きな声で、いつもより少しだけ小さく言った。「すぐもどるよ。たぶん！」", "Then, in its usual loud voice, a little quieter than usual: 'BACK SOON. PROBABLY!'", "А потом своим обычным громким голосом, чуть тише обычного: «СКОРО ВЕРНУСЬ. НАВЕРНОЕ!»"),
      L("隙間の向こうで、住人が言った。「いってらっしゃい。……右足から、ですよ」　豆に足はないのに。", "Beyond the gap, the occupant said: 'off you go. ……right foot first.' Beans have no feet.", "За щелью Жилец сказал: «Ступай. ……С правой ноги». Хотя у фасолинок нет ног."),
      L("エムリスの手の中に、空っぽの瓶が残った。軽かった。こんなに軽いものを、ずっと胸ポケットに入れていたのかと思った。", "An empty bottle was left in Emrys's hand. It was light. He thought: I carried something this light in my chest pocket all this time.", "В руке у Эмриса осталась пустая склянка. Лёгкая. Он подумал: столько времени носил в нагрудном кармане что-то настолько лёгкое."),
      L("振ってみた。からから、とは鳴らなかった。窓辺に置かれていた頃の、返事をしない瓶の音もしなかった。", "He shook it. No rattle. Not even the sound of the old bottle on the windowsill, the one that never answered.", "Он встряхнул её. Не загремела. Не было даже того звука, как у старой склянки на подоконнике, что никогда не отвечала."),
      L("その夜、エムリスは自分のためにプリンを買った。底のカラメルから食べた。苦いほうを、先に片づけておきたかった。", "That night Emrys bought a pudding for himself. He ate it from the caramel at the bottom up. He wanted the bitter part over with first.", "В ту ночь Эмрис купил пудинг себе. Ел с карамели на дне. Хотел сперва покончить с горьким."),
      L("蓋は、扉の隙間のところに置いておいた。", "He left the lid by the gap under the door.", "Крышечку он оставил у щели под дверью."),
      L("しばらくして、隙間の向こうから、ふたつの声がした。ひとつは静かに数えていて、もうひとつは大声で、プリンがあったと報告していた。", "After a while, two voices came from beyond the gap. One was quietly counting. The other was loudly reporting that there was pudding.", "Через какое-то время из-за щели послышались два голоса. Один тихо считал. Другой громко докладывал, что пудинг там есть."),
      L("「あったかいって！」と大きいほうの声が言った。「エムリス、こわくないよ！」", "'IT'S WARM!' said the louder voice. 'EMRYS, IT'S NOT SCARY!'", "«ТАМ ТЕПЛО! — сказал голос погромче. — ЭМРИС, НЕ СТРАШНО!»"),
      L("エムリスは空の瓶をポケットに戻した。ペンと一緒に。それは、思っていたより重かった。", "Emrys put the empty bottle back in his pocket. With the pens. It was heavier than he'd thought.", "Эмрис положил пустую склянку обратно в карман. К ручкам. Она оказалась тяжелее, чем он думал."),
    ],
  },
  both: {
    title: L("半歩ずつ", "Halfway", "По полшага"),
    text: [
      L("扉の向こうにあったのは、部屋ではなかった。廊下でもなかった。光の線が一本、床に引かれているだけだった。", "Beyond the door there was no room. No corridor either. Only a single line of light drawn across a floor.", "За дверью не было комнаты. И коридора не было. Только одна полоска света, проведённая по полу."),
      L("線の向こう側に、誰かが立っていた。暗くて顔は見えない。けれど、背の高さは同じだった。肩の落ち方も、左足で少しつっかえる立ち方も。", "Someone stood on the far side of the line. Too dark to see the face. But the height was the same. The slope of the shoulders. The way of standing, with a slight hitch on the left.", "По ту сторону черты кто-то стоял. Слишком темно, лица не видно. Но рост — тот же. Тот же наклон плеч. Та же манера стоять, с заминкой на левую."),
      L("「やっぱり、顔は見ないでおきましょう」と、その人は言った。「声は、自分の顔を間違えずにすむので」", "'let's not look at the face after all,' the figure said. 'a voice can't be wrong about its face.'", "«Давайте всё-таки не будем смотреть в лицо, — сказал он. — Голос не может ошибиться насчёт своего лица»."),
      L("二人は、それぞれ半歩ずつ前に出た。線の上で、肩が並んだ。ぶつかりはしなかった。もともと、そこにひとりぶんの場所しかなかったかのように、ぴったり収まった。", "Each of them took half a step forward. On the line, their shoulders came level. They didn't collide. They fit exactly, as though there had only ever been room for one.", "Каждый шагнул вперёд на полшага. На черте их плечи поравнялись. Они не столкнулись. Совпали в точности — словно места там всегда было на одного."),
      L("「交代しましょう」と住人が言った。「しばらく、私が夜勤をします。照明が良いところで働いてみたかった。あなたは、こっちで数えていてください。一、一、一。とても落ち着きますよ」", "'let's switch,' said the occupant. 'i'll take the night shift for a while. i've always wanted to work somewhere with better lighting. you stay here and count. one, one, one. it's very restful.'", "«Давайте поменяемся, — сказал Жилец. — Я какое-то время подежурю. Всегда хотел поработать там, где освещение получше. А вы побудьте здесь и посчитайте. Раз, раз, раз. Очень успокаивает»."),
      L("「患者に、プリンを」とエムリスは言った。「底から食べるやつもいる」", "'Bring the patients pudding,' Emrys said. 'Some of them eat it from the bottom.'", "«Носи пациентам пудинг, — сказал Эмрис. — Некоторые едят его снизу»."),
      L("「知っています。あなたがそうだから」", "'i know. you do.'", "«Знаю. Вы ведь так и едите»."),
      L("それから、どちらがどちら側に立っているのか、わからなくなった。わからなくていいのだと、二人とも、ほぼ同時に気づいた。", "After that, they could no longer tell who stood on which side. And both of them realized, at almost the same moment, that it didn't matter.", "После этого уже было не понять, кто на какой стороне. И оба почти одновременно поняли, что понимать и не нужно."),
      L("受付の時計は、三時三十三分と三時三十四分のあいだで、ちょうど半分だけ進んで止まった。", "The reception clock moved exactly halfway between 3:33 and 3:34, and stopped there.", "Часы в регистратуре сдвинулись ровно на полпути между тремя тридцатью тремя и тремя тридцатью четырьмя — и замерли."),
      L("廊下を、白衣の誰かが歩いていく。右足から。左で少しつっかえて。扉の向こうで、誰かがその歩数を数えている。", "Someone in a white coat walks down the corridor. Right foot first. A slight hitch on the left. Behind the door, someone counts the steps.", "По коридору идёт кто-то в белом халате. С правой ноги. С лёгкой заминкой на левую. За дверью кто-то считает шаги."),
      L("三十八。いつもどおりだ。", "Thirty-eight. As usual.", "Тридцать восемь. Как всегда."),
    ],
  },
};

export const DOOR = { greetings: GREETINGS, hub: "hub", nodes: N, endings: ENDINGS };
