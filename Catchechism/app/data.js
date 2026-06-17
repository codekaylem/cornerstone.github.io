/* Cornerstone — lesson data drawn from the 1689 London Baptist Confession (Modern English).
   Question types:
     mc        multiple choice            { prompt, options[], answer:idx, explain }
     truefalse true / false               { statement, answer:bool, explain }
     blank     fill the blank (tap word)  { before, after, options[], answer:str, explain }
     tapwords  build the sentence         { prompt, answer:[words], bank:[extra] , explain}
     type      type the answer            { prompt, accept:[str], answer, explain }
     match     match the pairs            { prompt, pairs:[{a,b}] }
     passage   read then answer           { ref, passage, question, options[], answer:idx, explain }
*/
(function () {
  // ── Chapter 1 · Of the Holy Scriptures ────────────────────────────────
  const ch1 = {
    id: 1, chapter: 1, title: 'Of the Holy Scriptures', short: 'The Scriptures',
    blurb: 'Where everything begins — how God has made himself known.', theme: 'red',
    lessons: [
      {
        id: '1-1', title: 'The only sure rule', icon: 'book',
        questions: [
          { type: 'mc', prompt: 'According to the Confession, what is "the only sufficient, certain, and infallible rule of all saving knowledge, faith, and obedience"?',
            options: ['The Holy Scripture', 'The conscience of man', 'The light of nature', 'The councils of the church'],
            answer: 0, explain: 'Chapter 1.1 — Scripture alone is that sufficient, certain, and infallible rule.' },
          { type: 'truefalse', statement: 'The light of nature and the works of creation are enough, by themselves, to give the saving knowledge of God.',
            answer: false, explain: 'They reveal enough to leave men inexcusable, yet are not sufficient for the knowledge needed unto salvation.' },
          { type: 'blank', before: 'The light of nature and the works of creation leave men',
            after: ', yet cannot save them.', options: ['inexcusable', 'innocent', 'enlightened', 'righteous'],
            answer: 'inexcusable', explain: 'Creation manifests God\u2019s power so far as to leave men inexcusable (cf. Romans 1).' },
          { type: 'mc', prompt: 'Why did it please God to commit his revelation wholly to writing?',
            options: ['For the better preserving and propagating of the truth', 'To replace the need for preaching', 'Because the apostles demanded it', 'To shorten the church\u2019s memory work'],
            answer: 0, explain: '1.1 — committed to writing for preserving and propagating truth against the corruption of the flesh and malice of Satan.' },
        ],
      },
      {
        id: '1-2', title: 'The canon & its authority', icon: 'scroll', hero: true,
        questions: [
          { type: 'mc', prompt: 'How many books make up the canon of Holy Scripture in the Confession?',
            options: ['66 (Old and New Testaments)', '73, including the Apocrypha', '40 books of the Law', 'It leaves the number open'],
            answer: 0, explain: '1.2 — all the books of the Old and New Testaments, given by inspiration of God.' },
          { type: 'truefalse', statement: 'The books called the Apocrypha are part of the canon and carry authority for the church.',
            answer: false, explain: '1.3 — being not of divine inspiration, the Apocrypha is no part of the canon and of no authority to the church.' },
          { type: 'passage', ref: 'Chapter 1, Paragraph 4',
            passage: 'The authority of the Holy Scripture, for which it ought to be believed, depends not upon the testimony of any man or church, but wholly upon God (who is truth itself), the author of it; therefore it is to be received because it is the Word of God.',
            question: 'On what does the authority of Scripture finally depend?',
            options: ['Wholly upon God, its author', 'Upon the testimony of the church', 'Upon the agreement of scholars', 'Upon the reader\u2019s experience'],
            answer: 0, explain: 'Its authority rests wholly on God, who is truth itself \u2014 not on any human or church witness.' },
          { type: 'blank', before: 'Our full persuasion and assurance of the truth of Scripture is from the inward work of the',
            after: '.', options: ['Holy Spirit', 'church fathers', 'human reason', 'light of nature'],
            answer: 'Holy Spirit', explain: '1.5 — assurance comes from the Spirit bearing witness by and with the Word in our hearts.' },
          { type: 'match', prompt: 'Match each idea to its source of authority.',
            pairs: [
              { a: 'Supreme judge of all controversies', b: 'The Holy Scripture' },
              { a: 'Leaves all men inexcusable', b: 'The light of nature' },
              { a: 'No authority for the church', b: 'The Apocrypha' },
              { a: 'Inward assurance of the Word', b: 'The Holy Spirit' },
            ] },
          { type: 'type', prompt: 'Fill in the word: "The supreme judge by which all controversies of religion are to be determined can be no other but the Holy ________."',
            accept: ['scripture', 'scriptures'], answer: 'Scripture',
            explain: '1.10 — the Holy Scripture, delivered by the Spirit, is the supreme judge.' },
          { type: 'truefalse', statement: 'Even the unlearned, using ordinary means, may attain a sufficient understanding of the things necessary for salvation.',
            answer: true, explain: '1.7 — the perspicuity of Scripture: what must be known for salvation is clearly opened.' },
        ],
      },
      { id: '1-3', title: 'Review: The Scriptures', icon: 'star', review: true,
        questions: [
          { type: 'mc', prompt: 'Scripture is necessary because the former ways of God revealing his will are now —',
            options: ['ceased', 'forbidden', 'hidden', 'repeated'], answer: 0,
            explain: '1.1 — those former ways of revealing have now ceased, making the written Word most necessary.' },
          { type: 'truefalse', statement: 'Nothing is to be added to Scripture, whether by new revelation or traditions of men.',
            answer: true, explain: '1.6 — the whole counsel of God is set down; nothing is to be added.' },
          { type: 'blank', before: 'The original Hebrew and Greek were kept pure in all ages by God\u2019s singular care and',
            after: '.', options: ['providence', 'scholarship', 'fortune', 'councils'], answer: 'providence',
            explain: '1.8 — kept pure by his singular care and providence, therefore authentic.' },
        ],
      },
    ],
  };

  // ── Chapter 2 · Of God and of the Holy Trinity ────────────────────────
  const ch2 = {
    id: 2, chapter: 2, title: 'Of God and the Holy Trinity', short: 'God & Trinity',
    blurb: 'The one living and true God in three persons.', theme: 'navy',
    lessons: [
      {
        id: '2-1', title: 'One living and true God', icon: 'flame',
        questions: [
          { type: 'mc', prompt: 'How many living and true Gods does the Confession affirm?',
            options: ['One', 'Three', 'One for each person', 'It does not say'],
            answer: 0, explain: '2.1 — there is but one only living and true God.' },
          { type: 'truefalse', statement: 'God is subject to change, passions, and growth over time.',
            answer: false, explain: '2.1 — God is immutable, without body, parts, or passions.' },
          { type: 'blank', before: 'God is most holy, most wise, most free, most absolute, working all things according to the counsel of his own',
            after: '.', options: ['will', 'creatures', 'people', 'angels'], answer: 'will',
            explain: '2.1 — he works all things by the counsel of his own immutable and most righteous will.' },
        ],
      },
      {
        id: '2-2', title: 'Three persons, one substance', icon: 'triangle',
        questions: [
          { type: 'mc', prompt: 'In the one divine Being, there are three persons. Which three?',
            options: ['Father, Son, and Holy Spirit', 'Father, Son, and Mary', 'God, angels, and saints', 'Creator, Word, and Church'],
            answer: 0, explain: '2.3 — the Father, the Word (Son), and the Holy Spirit, one in substance, power, and eternity.' },
          { type: 'match', prompt: 'Match each person to how the Confession describes their relation.',
            pairs: [
              { a: 'The Father', b: 'is of none, neither begotten nor proceeding' },
              { a: 'The Son', b: 'is eternally begotten of the Father' },
              { a: 'The Holy Spirit', b: 'proceeds from the Father and the Son' },
            ] },
          { type: 'truefalse', statement: 'The three persons are three separate Gods.',
            answer: false, explain: '2.3 — one God, one substance; the distinction is of persons, not of essence.' },
          { type: 'type', prompt: 'The three persons are one in substance, power, and ________.',
            accept: ['eternity', 'eternal'], answer: 'eternity',
            explain: '2.3 — one in substance, power, and eternity.' },
        ],
      },
    ],
  };

  // ── Chapter 3 · Of God's Decree ───────────────────────────────────────
  const ch3 = {
    id: 3, chapter: 3, title: "Of God's Decree", short: "God's Decree",
    blurb: 'God\u2019s eternal purpose, and how it never makes him the author of sin.', theme: 'red',
    lessons: [
      {
        id: '3-1', title: 'He ordains all things', icon: 'compass',
        questions: [
          { type: 'mc', prompt: 'From all eternity God did freely and unchangeably ordain —',
            options: ['Whatsoever comes to pass', 'Only the good that happens', 'Nothing in particular', 'Only the end, never the means'],
            answer: 0, explain: '3.1 — God ordained whatsoever comes to pass, yet so as he is not the author of sin.' },
          { type: 'truefalse', statement: 'Because God ordains all things, he is therefore the author of sin and forces men\u2019s wills.',
            answer: false, explain: '3.1 — neither is God the author of sin, nor is violence offered to the will of the creature.' },
          { type: 'blank', before: 'God ordained all things, yet not so as to take away the liberty or contingency of',
            after: ' causes.', options: ['second', 'first', 'holy', 'divine'], answer: 'second',
            explain: '3.1 — the liberty and contingency of second causes is established, not taken away.' },
        ],
      },
      {
        id: '3-2', title: 'Election & grace', icon: 'seal',
        questions: [
          { type: 'mc', prompt: 'Those predestined to life were chosen —',
            options: ['Out of God\u2019s free grace and love, not foreseen merit', 'Because God foresaw their good works', 'By their own decision first', 'At random'],
            answer: 0, explain: '3.5 — chosen out of free grace and love, without any foresight of faith or works as conditions moving him.' },
          { type: 'truefalse', statement: 'The doctrine of predestination should be handled with special prudence and care.',
            answer: true, explain: '3.7 — this high mystery is to be handled with special prudence and care.' },
        ],
      },
    ],
  };

  // Chapters 4–32 are authored in app/chapters-*.js and arrive on window.CH_MORE
  const units = [ch1, ch2, ch3, ...(window.CH_MORE || [])];

  // Achievements ---------------------------------------------------------
  const achievements = [
    { id: 'first', name: 'First Light', desc: 'Finish your first lesson', icon: 'sun', tier: 'earned' },
    { id: 'streak3', name: 'Kindling', desc: 'Reach a 3-day streak', icon: 'flame', tier: 'earned' },
    { id: 'perfect', name: 'Spotless', desc: 'Complete a lesson with no hearts lost', icon: 'shield', tier: 'earned' },
    { id: 'scholar', name: 'Sola Scriptura', desc: 'Finish the chapter on Scripture', icon: 'book', tier: 'progress', progress: 0.66 },
    { id: 'streak7', name: 'Steady Flame', desc: 'Reach a 7-day streak', icon: 'flame', tier: 'progress', progress: 0.42 },
    { id: 'theologian', name: 'Confessor', desc: 'Finish all 32 chapters', icon: 'crown', tier: 'locked' },
  ];

  window.CORNERSTONE = {
    units, achievements,
    user: {
      name: 'Friend', streak: 3, hearts: 5, maxHearts: 5, heartsAt: null,
      xp: 480, dailyGoal: 50, dailyXp: 30, gems: 42, perfectLessons: 0,
      // progress: lessons completed (ids)
      done: ['1-1'],
      weak: [], // fingerprints of questions missed, for Weak Spots practice
      // current playable node
      current: '1-2',
      week: [true, true, true, false, false, false, false], // mon..sun of this week
      joined: 'June 2026',
      account: null, // {provider, label, name, email} once signed in
    },
  };
})();
