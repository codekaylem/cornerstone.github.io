/* Cornerstone — Reading metadata: per-section TITLE + scripture references,
   keyed by chapter then by section (paragraph) index. The reader pairs this
   with window.READING (the body text) to render the modern-English layout:
   a numbered section heading, the text with footnote markers, and the
   scripture proof-texts listed beneath. Refs are optional per section. */
(function () {
  const M = (window.READING_META = {});

  M[1] = [
    { t: "The Bible Is Infallible, Sufficient, and Necessary", r: ["2 Timothy 3:15-17; Isaiah 8:20; Luke 16:29, 31; Ephesians 2:20", "Romans 1:19-21; Romans 2:14-15; Psalms 19:1-3", "Hebrews 1:1", "Proverbs 22:19-21; Romans 15:4; 2 Peter 1:19-20"] },
    { t: "The Books of the Bible", r: ["2 Timothy 3:16"] },
    { t: "The Apocrypha Are Not Inspired", r: ["Luke 24:27, 44; Romans 3:2"] },
    { t: "The Bible Is Authoritative Because It Is the Word of God", r: ["2 Peter 1:19-21; 2 Timothy 3:16; 1 Thessalonians 2:13; 1 John 5:9"] },
    { t: "Reasons We Should Believe the Bible", r: ["John 16:13-14; 1 Corinthians 2:10-12; 1 John 2:20, 27"] },
    { t: "The Whole Counsel of God Is in the Bible", r: ["2 Timothy 3:15-17; Galatians 1:8-9", "John 6:45; 1 Corinthians 2:9-12; 1 Corinthians 11:13-14; 14:26, 40"] },
    { t: "Some Parts of the Bible Are Clearer Than Others", r: ["2 Peter 3:16; Psalms 19:7; Psalms 119:130"] },
    { t: "The Bible Must Be Kept Pure and Translated", r: ["Romans 3:2; Isaiah 8:20; Acts 15:15", "John 5:39; 1 Corinthians 14:6, 9, 11-12, 28; Colossians 3:16"] },
    { t: "The Bible Interprets the Bible", r: ["2 Peter 1:20-21; Acts 15:15-16"] },
    { t: "The Bible Is the Supreme Judge", r: ["Matthew 22:29, 31-32; Ephesians 2:20; Acts 28:23"] },
  ];

  M[2] = [
    { t: "There Is Only One God", r: ["1 Corinthians 8:4, 6; Deuteronomy 6:4; Jeremiah 10:10; Exodus 3:14; John 4:24; 1 Timothy 1:17; Deuteronomy 4:15-16"] },
    { t: "God Is All-Sufficient and Sovereign", r: ["John 5:26; Psalms 119:68; Acts 17:24-25; Job 22:2-3; Romans 11:34-36; Daniel 4:25, 34-35; Hebrews 4:13"] },
    { t: "God Exists in Three Persons", r: ["1 John 5:7; Matthew 28:19; 2 Corinthians 13:14; Exodus 3:14; John 14:11; 1 Corinthians 8:6; John 1:14, 18; 15:26; Galatians 4:6"] },
  ];

  M[3] = [
    { t: "God Has Decreed All Things", r: ["Isaiah 46:10; Ephesians 1:11; Hebrews 6:17; Romans 9:15, 18; James 1:13; 1 John 1:5; Acts 4:27-28; John 19:11"] },
    { t: "God's Decree Is Not Based on Foreknowledge", r: ["Acts 15:18; Romans 9:11, 13, 16, 18"] },
    { t: "God Has Predestined Some to Life", r: ["1 Timothy 5:21; Matthew 25:34; Ephesians 1:5-6; Romans 9:22-23; Jude 4"] },
    { t: "The Number of the Elect Is Fixed", r: ["2 Timothy 2:19; John 13:18"] },
    { t: "The Elect Were Chosen in Christ by Grace", r: ["Ephesians 1:4, 9, 11; Romans 8:30; 2 Timothy 1:9; 1 Thessalonians 5:9; Romans 9:13, 16; Ephesians 2:5, 12"] },
    { t: "God Appointed the Means as Well as the End", r: ["1 Peter 1:2; 2 Thessalonians 2:13; 1 Thessalonians 5:9-10; Titus 2:14; John 17:9; Romans 8:28; John 6:64-65; 10:26; 8:47; 1 John 2:19"] },
    { t: "Predestination Is to Be Handled with Care", r: ["1 Thessalonians 1:4-5; 2 Peter 1:10; Ephesians 1:6; Romans 11:33; 11:5-6, 20; Luke 10:20"] },
  ];

  M[4] = [
    { t: "God Created All Things in Six Days", r: ["John 1:2-3; Hebrews 1:2; Job 26:13; Romans 1:20; Colossians 1:16; Genesis 1:31"] },
    { t: "God Created Man, Male and Female", r: ["Genesis 1:27; 2:7; Ecclesiastes 7:29; Genesis 1:26; Romans 2:14-15; Genesis 3:6"] },
    { t: "God Gave a Command Not to Eat", r: ["Genesis 2:17; 3:8-11, 23; Genesis 1:26, 28"] },
  ];

  M[5] = [
    { t: "God Upholds and Governs All Creatures", r: ["Hebrews 1:3; Job 38-41; Isaiah 46:10-11; Psalms 135:6; Matthew 10:29-31; Ephesians 1:11; Proverbs 15:3"] },
    { t: "God Orders All Through Second Causes", r: ["Acts 2:23; Proverbs 16:33; Genesis 8:22"] },
    { t: "God Works Through Means, Yet Is Free", r: ["Acts 27:31, 44; Isaiah 55:10-11; Hosea 1:7; Romans 4:19-21; Daniel 3:27"] },
    { t: "God's Providence Extends Even to Sin", r: ["Romans 11:32-34; 2 Samuel 24:1; 1 Chronicles 21:1; 2 Kings 19:28; Psalms 76:10; Genesis 50:20; Isaiah 10:6-7, 12; James 1:13-14, 17; 1 John 2:16"] },
    { t: "God Uses Trials for His Children's Good", r: ["2 Chronicles 32:25-26, 31; 2 Corinthians 12:7-9; Romans 8:28"] },
    { t: "God Hardens the Wicked", r: ["Romans 1:24-26, 28; 11:7-8; Deuteronomy 29:4; Matthew 13:12; Exodus 8:15, 32; Isaiah 8:14; 2 Thessalonians 2:10-12; Psalms 81:11-12"] },
    { t: "God Especially Cares for His Church", r: ["1 Timothy 4:10; Amos 9:8-9; Romans 8:28; Isaiah 43:3-5"] },
  ];

  M[6] = [
    { t: "Our First Parents Fell into Sin", r: ["Genesis 3:12-13; 2 Corinthians 11:3; Romans 11:32"] },
    { t: "Sin Brought Death and Total Corruption", r: ["Romans 3:23; 5:12; Titus 1:15; Genesis 6:5; Jeremiah 17:9; Romans 3:10-19"] },
    { t: "Original Sin Is Imputed to All", r: ["Romans 5:12-19; 1 Corinthians 15:21-22, 45, 49; Psalms 51:5; Job 14:4; Ephesians 2:3; Romans 6:20; Hebrews 2:14-15; 1 Thessalonians 1:10"] },
    { t: "All Sins Flow from This Corruption", r: ["Romans 8:7; Colossians 1:21; James 1:14-15; Matthew 15:19"] },
    { t: "Corruption Remains in the Regenerate", r: ["Romans 7:18, 23; Ecclesiastes 7:20; 1 John 1:8; Romans 7:23-25; Galatians 5:17"] },
  ];

  M[7] = [
    { t: "God Relates to Us by Covenant", r: ["Luke 17:10; Job 35:7-8"] },
    { t: "The Covenant of Grace", r: ["Genesis 2:17; Galatians 3:10; Romans 3:20-21; Mark 16:15-16; John 3:16; Ezekiel 36:26-27; John 6:44-45; Psalms 110:3"] },
    { t: "The Covenant Revealed in the Gospel", r: ["Genesis 3:15; Hebrews 1:1; 2 Timothy 1:9; Titus 1:2; Hebrews 11:6, 13; Romans 4:1-2; Acts 4:12; John 8:56"] },
  ];

  M[8] = [
    { t: "God Ordained Christ to Be Mediator", r: ["Isaiah 42:1; 1 Peter 1:19-20; Acts 3:22; Hebrews 5:5-6; Psalms 2:6; Luke 1:33; Ephesians 1:22-23; Hebrews 1:2; Acts 17:31; John 17:6; Romans 8:30"] },
    { t: "Christ Is Truly God and Truly Man", r: ["John 1:14; Galatians 4:4; Romans 8:3; Hebrews 2:14, 16-17; 4:15; Matthew 1:22-23; Luke 1:27, 31, 35; Romans 9:5; 1 Timothy 2:5"] },
    { t: "Christ Was Equipped for His Office", r: ["Psalms 45:7; Acts 10:38; John 3:34; Colossians 2:3; 1:19; Hebrews 7:26; John 1:14; Hebrews 7:22; 5:4-5"] },
    { t: "Christ Accomplished His Work", r: ["Psalms 40:7-8; Hebrews 10:5-10; John 10:18; Galatians 4:4; Matthew 3:15; Galatians 3:13; Isaiah 53:6; 2 Corinthians 5:21; Matthew 26:37-38; Luke 22:44; Acts 13:37; 1 Corinthians 15:3-4; Mark 16:19; Romans 8:34; Acts 1:11; 10:42"] },
    { t: "Christ Satisfied Divine Justice", r: ["Hebrews 9:14; 10:14; Romans 3:25-26; John 17:2; Hebrews 9:15"] },
    { t: "Redemption Applied in Every Age", r: ["1 Corinthians 4:10; Hebrews 4:2; 1 Peter 1:10-11; Revelation 13:8; Hebrews 13:8"] },
    { t: "Christ Works by Both Natures", r: ["John 3:13; Acts 20:28"] },
    { t: "Christ Applies His Redemption", r: ["John 6:37; 10:15-16; 17:9; Romans 5:10; John 17:6; Ephesians 1:9; 1 John 5:20; Romans 8:9, 14; Psalms 110:1; 1 Corinthians 15:25-26"] },
    { t: "Redemption Is for the Elect Alone", r: ["John 6:37, 39; 10:15-16; 17:9"] },
    { t: "Christ's Death Is Sufficient and Effective", r: ["John 10:15; 1 John 2:2; John 3:16; 1 Corinthians 1:30-31; Ephesians 1:6"] },
  ];

  M[9] = [
    { t: "The Will Has Natural Liberty", r: ["Matthew 17:12; James 1:14; Deuteronomy 30:19"] },
    { t: "Innocent Man Could Will the Good", r: ["Ecclesiastes 7:29; Genesis 3:6"] },
    { t: "Fallen Man Cannot Will Spiritual Good", r: ["Romans 5:6; 8:7; John 6:44; Ephesians 2:1, 5; Titus 3:3-5"] },
    { t: "Grace Frees the Will", r: ["Colossians 1:13; John 8:36; Philippians 2:13; Romans 7:15, 18-19, 21, 23"] },
    { t: "The Will Is Perfectly Free in Glory", r: ["Ephesians 4:13"] },
  ];

  M[10] = [
    { t: "God Effectually Calls the Elect", r: ["Romans 8:30; 11:7; Ephesians 1:10-11; 2 Thessalonians 2:13-14; Ephesians 2:1-6; Acts 26:18; Ezekiel 36:26; John 6:44-45; Ephesians 1:19; Psalms 110:3; Song of Solomon 1:4"] },
    { t: "Calling Is by Grace Alone", r: ["2 Timothy 1:9; Ephesians 2:8; 1 Corinthians 2:14; Ephesians 1:19-20; John 5:25; Ephesians 2:5"] },
    { t: "Elect Infants and Others Are Saved", r: ["John 3:3, 5-6; John 3:8"] },
    { t: "The Non-Elect Are Not Saved", r: ["Matthew 22:14; 13:20-21; Hebrews 6:4-5; John 6:44-45, 64-66; 8:24; Acts 4:12; John 14:6; Ephesians 2:12; John 4:22; 17:3"] },
  ];

  M[11] = [
    { t: "God Freely Justifies the Called", r: ["Romans 3:24; 8:30; Romans 4:5-8; Ephesians 1:7; 1 Corinthians 1:30-31; Romans 5:17-19; Philippians 3:8-9; Ephesians 2:8-10; John 1:12"] },
    { t: "Faith Is the Instrument of Justification", r: ["Romans 3:28; Galatians 5:6; James 2:17, 22, 26"] },
    { t: "Christ's Obedience Is the Ground", r: ["Hebrews 10:14; 1 Peter 1:18-19; Isaiah 53:5-6; Romans 3:26; 8:30; Ephesians 2:7"] },
    { t: "The Elect Are Justified in Due Time", r: ["Galatians 3:8; 1 Peter 1:2, 19-20; Romans 8:30; Galatians 4:4; 1 Timothy 2:6; Romans 4:25; Colossians 1:21-22; Titus 3:4-7"] },
    { t: "The Justified May Fall Under Displeasure", r: ["Matthew 6:12; 1 John 1:7, 9; John 10:28; Psalms 89:31-33; 32:5; 51; Matthew 26:75"] },
    { t: "Justification Is the Same in Both Testaments", r: ["Galatians 3:9; Romans 4:22-24"] },
  ];

  M[12] = [
    { t: "God Adopts the Justified", r: ["Ephesians 1:5; Galatians 4:4-5; John 1:12; Romans 8:17; 2 Corinthians 6:18; Revelation 3:12; Romans 8:15; Ephesians 3:12; Romans 5:2; Galatians 4:6; Psalms 103:13; Proverbs 14:26; 1 Peter 5:7; Hebrews 12:6; Isaiah 54:8-9; Ephesians 4:30; Hebrews 1:14; 6:12"] },
  ];

  M[13] = [
    { t: "The Regenerate Are Further Sanctified", r: ["Acts 20:32; Romans 6:5-6; John 17:17; Ephesians 3:16-19; 1 Thessalonians 5:21-23; Romans 6:14; Galatians 5:24; Colossians 1:11; Hebrews 12:14"] },
    { t: "Sanctification Is Imperfect in This Life", r: ["1 Thessalonians 5:23; Romans 7:18, 23; Galatians 5:17; 1 Peter 2:11"] },
    { t: "The Regenerate Overcome and Grow", r: ["Romans 7:23; 6:14; Ephesians 4:15-16; 2 Corinthians 3:18; 7:1"] },
  ];

  M[14] = [
    { t: "Faith Is the Work of the Spirit", r: ["2 Corinthians 4:13; Ephesians 2:8; Romans 10:14, 17; Luke 17:5; 1 Peter 2:2; Acts 20:32"] },
    { t: "Faith Believes and Rests on Christ", r: ["John 4:42; 1 Thessalonians 2:13; 1 John 5:10; Acts 24:14; Psalms 19:7-10; 119:72; 2 Timothy 1:12; Hebrews 11:13; John 1:12; Acts 16:31; Galatians 2:20; Acts 15:11"] },
    { t: "Faith Grows to Full Assurance", r: ["Hebrews 5:13-14; Romans 4:19-20; Matthew 6:30; 8:10; 2 Peter 1:1; Ephesians 6:16; 1 John 5:4-5; Hebrews 6:11-12; Colossians 2:2; Hebrews 12:2"] },
  ];

  M[15] = [
    { t: "God Grants Repentance to the Converted", r: ["Titus 3:2-5; 2 Corinthians 7:11"] },
    { t: "God Provides Repentance for Believers", r: ["Ecclesiastes 7:20; Luke 22:31-32"] },
    { t: "What Saving Repentance Is", r: ["Zechariah 12:10; Acts 11:18; Ezekiel 36:31; 2 Corinthians 7:11; Psalms 119:6, 128"] },
    { t: "Repentance Is to Be Lifelong", r: ["Luke 19:8; 1 Timothy 1:13, 15"] },
  ];

  M[16] = [
    { t: "Good Works Are Those God Commands", r: ["Micah 6:8; Hebrews 13:21; Matthew 15:9; Isaiah 29:13"] },
    { t: "Good Works Evidence True Faith", r: ["James 2:18, 22; Psalms 116:12-13; 1 John 2:3, 5; 2 Peter 1:5-11; Matthew 5:16; 1 Timothy 6:1; 1 Peter 2:15; Ephesians 2:10; Romans 6:22"] },
    { t: "Ability for Good Works Is from the Spirit", r: ["John 15:4-5; 2 Corinthians 3:5; Philippians 2:13; Philippians 2:12; Hebrews 6:11-12; Isaiah 64:7"] },
    { t: "Even Our Best Falls Short", r: ["Job 9:2-3; Galatians 5:17; Luke 17:10"] },
    { t: "We Cannot Merit Anything from God", r: ["Romans 3:20; Ephesians 2:8-9; Romans 4:6; Galatians 5:22-23; Isaiah 64:6; Psalms 143:2; 130:3"] },
    { t: "Believers' Works Are Accepted in Christ", r: ["Ephesians 1:6; 1 Peter 2:5; Matthew 25:21, 23; Hebrews 6:10"] },
    { t: "Works of the Unregenerate Are Sinful", r: ["2 Kings 10:30-31; 1 Kings 21:27, 29; Genesis 4:5; Hebrews 11:4, 6; 1 Corinthians 13:3; Matthew 6:2, 5; Amos 5:21-22; Romans 9:16; Titus 3:5; Matthew 25:41-43"] },
  ];

  M[17] = [
    { t: "The Saints Will Persevere to the End", r: ["John 10:28-29; Philippians 1:6; 2 Timothy 2:19; 1 John 2:19; Psalms 89:31-32; 1 Corinthians 11:32"] },
    { t: "Perseverance Rests on God, Not on Us", r: ["Romans 8:30; 9:11, 16; Romans 5:9-10; John 14:19; Hebrews 6:17-18; 1 John 3:9; Jeremiah 32:40"] },
    { t: "Yet Believers May Fall into Grievous Sin", r: ["Matthew 26:70, 72, 74; Isaiah 64:5, 9; Ephesians 4:30; Psalms 51:10, 12; 32:3-4; 2 Samuel 12:14; Luke 22:32, 61-62"] },
  ];

  M[18] = [
    { t: "True Believers May Have Assurance", r: ["Job 8:13-14; Matthew 7:22-23; 1 John 2:3; 3:14, 18-19, 21, 24; 5:13; Romans 5:2, 5"] },
    { t: "Assurance Is Founded on Christ", r: ["Hebrews 6:11, 19; 6:17-18; 2 Peter 1:4-5, 10-11; Romans 8:15-16; 1 John 3:1-3"] },
    { t: "Assurance May Be Attained over Time", r: ["Isaiah 50:10; Psalms 88; 1 John 4:13; Hebrews 6:11-12; Romans 5:1-2, 5; 14:17; Psalms 119:32; 2 Peter 1:10; Titus 2:11-12, 14"] },
    { t: "Assurance May Be Shaken and Revived", r: ["Song of Solomon 5:2-3, 6; Psalms 51:8, 12, 14; 31:22; 30:7; 1 John 3:9; Luke 22:32; Psalms 42:5, 11; Lamentations 3:26-31"] },
  ];

  M[19] = [
    { t: "God Gave Adam a Law of Obedience", r: ["Genesis 1:27; Ecclesiastes 7:29; Romans 10:5; Galatians 3:10, 12"] },
    { t: "The Moral Law Continued After the Fall", r: ["Romans 2:14-15; Deuteronomy 10:4"] },
    { t: "Ceremonial Laws Were Given and Abrogated", r: ["Hebrews 10:1; Colossians 2:17; 1 Corinthians 5:7; Colossians 2:14, 16-17; Ephesians 2:14-16"] },
    { t: "Judicial Laws Have Expired", r: ["1 Corinthians 9:8-10"] },
    { t: "The Moral Law Forever Binds All", r: ["Romans 13:8-10; James 2:8, 10-12; Matthew 5:17-19; Romans 3:31"] },
  ];

  M[20] = [
    { t: "God Gave the Promise of Christ", r: ["Genesis 3:15; Revelation 13:8"] },
    { t: "The Gospel Is Revealed Only by the Word", r: ["Romans 1:17; 10:14-15, 17; Proverbs 29:18; Isaiah 25:7; 60:2-3"] },
    { t: "The Gospel's Spread Is by God's Will", r: ["Psalms 147:20; Acts 16:7; Romans 1:18-32"] },
    { t: "The Spirit Must Work for It to Save", r: ["Psalms 110:3; 1 Corinthians 2:14; Ephesians 1:19-20; John 6:44; 2 Corinthians 4:4, 6"] },
  ];

  M[21] = [
    { t: "The Liberty Christ Has Purchased", r: ["Galatians 3:13; 1:4; Acts 26:18; Romans 8:3, 28; 1 Corinthians 15:54-57; Romans 5:1-2; 8:14-15; 1 John 4:18; Galatians 3:9, 14; John 7:38-39; Hebrews 10:19-21"] },
    { t: "God Alone Is Lord of the Conscience", r: ["James 4:12; Romans 14:4; Acts 4:19; 5:29; 1 Corinthians 7:23; Matthew 15:9; Colossians 2:20, 22-23; 2 Corinthians 1:24"] },
    { t: "Liberty Is Not a License to Sin", r: ["Romans 6:1-2; Galatians 5:13; 2 Peter 2:18, 21; Luke 1:74-75"] },
  ];

  M[22] = [
    { t: "God Is to Be Worshiped His Way", r: ["Jeremiah 10:7; Mark 12:33; Deuteronomy 12:32; Exodus 20:4-6"] },
    { t: "Worship Is Due to God Alone, Through Christ", r: ["Matthew 4:9-10; John 5:23; 2 Corinthians 13:14; John 14:6; 1 Timothy 2:5; Colossians 2:18; Revelation 19:10"] },
    { t: "Prayer Is a Part of Worship", r: ["Psalms 95:1-7; 65:2; John 14:13-14; Romans 8:26; 1 John 5:14; 1 Corinthians 14:16-17"] },
    { t: "What We Are to Pray For", r: ["1 Timothy 2:1-2; 2 Samuel 7:29; 1 John 5:16"] },
    { t: "The Parts of Religious Worship", r: ["Acts 15:21; 2 Timothy 4:2; Luke 8:18; Colossians 3:16; Ephesians 5:19; Matthew 28:19-20; 1 Corinthians 11:26"] },
    { t: "Worship Is Tied to No One Place", r: ["John 4:21; Malachi 1:11; 1 Timothy 2:8; Acts 10:2; Matthew 6:11; Psalms 55:17; Hebrews 10:25; Acts 2:42"] },
    { t: "One Day in Seven Is the Sabbath", r: ["Exodus 20:8; 1 Corinthians 16:1-2; Acts 20:7; Revelation 1:10"] },
    { t: "How the Sabbath Is Kept Holy", r: ["Isaiah 58:13; Nehemiah 13:15-22; Matthew 12:1-13"] },
  ];

  M[23] = [
    { t: "What a Lawful Oath Is", r: ["Exodus 20:7; Deuteronomy 10:20; Jeremiah 4:2; 2 Chronicles 6:22-23"] },
    { t: "Oaths Are by God's Name Alone", r: ["Matthew 5:34, 37; James 5:12; Hebrews 6:16; 2 Corinthians 1:23; Nehemiah 13:25"] },
    { t: "Oaths Must Be Truthful", r: ["Leviticus 19:12; Jeremiah 23:10"] },
    { t: "Vows Are Made to God Alone", r: ["Psalms 76:11; Genesis 28:20-22; Deuteronomy 23:21-23"] },
  ];

  M[24] = [
    { t: "God Has Ordained Civil Magistrates", r: ["Romans 13:1-4"] },
    { t: "Christians May Serve as Magistrates", r: ["2 Samuel 23:3; Psalms 82:3-4; Luke 3:14"] },
    { t: "The Duty of People Toward Magistrates", r: ["Romans 13:5-7; 1 Peter 2:17; 1 Timothy 2:1-2"] },
  ];

  M[25] = [
    { t: "Marriage Is One Man and One Woman", r: ["Genesis 2:24; Malachi 2:15; Matthew 19:5-6"] },
    { t: "The Purposes of Marriage", r: ["Genesis 2:18; 1:28; 1 Corinthians 7:2, 9"] },
    { t: "Who May Marry, and Marrying in the Lord", r: ["Hebrews 13:4; 1 Timothy 4:3; 1 Corinthians 7:39; Nehemiah 13:25-27"] },
    { t: "Forbidden Degrees of Marriage", r: ["Leviticus 18; Mark 6:18; 1 Corinthians 5:1"] },
  ];

  M[26] = [
    { t: "The Universal (Invisible) Church", r: ["Hebrews 12:23; Colossians 1:18; Ephesians 1:10, 22-23; 5:23, 27, 32"] },
    { t: "Visible Saints and Congregations", r: ["1 Corinthians 1:2; Acts 11:26; Romans 1:7; Ephesians 1:20-22"] },
    { t: "Churches Are Subject to Error", r: ["1 Corinthians 5; Revelation 2-3; 18:2; 2 Thessalonians 2:11-12; Matthew 16:18; Psalms 72:17; 102:28; Revelation 12:17"] },
    { t: "Christ Is the Head of the Church", r: ["Colossians 1:18; Matthew 28:18-20; Ephesians 4:11-12; 2 Thessalonians 2:3-9"] },
    { t: "Christ Calls and Gathers His Church", r: ["John 10:16; 12:32; Matthew 28:20; 18:15-20"] },
    { t: "Members Are Saints by Calling", r: ["Romans 1:7; 1 Corinthians 1:2; Acts 2:41-42; 5:13-14; 2 Corinthians 9:13"] },
    { t: "Christ Gives Churches Authority", r: ["Matthew 18:17-18; 1 Corinthians 5:4-5, 13; 2 Corinthians 2:6-8"] },
    { t: "The Officers: Elders and Deacons", r: ["Acts 20:17, 28; Philippians 1:1"] },
    { t: "Calling Elders and Deacons", r: ["Acts 14:23; 1 Timothy 3; Acts 6:3, 5-6"] },
    { t: "Supporting the Pastors", r: ["1 Timothy 3:2; Acts 6:4; Hebrews 13:17; 1 Timothy 5:17-18; Galatians 6:6-7; 1 Corinthians 9:6-14"] },
    { t: "Others May Also Preach the Word", r: ["Acts 11:19-21; 1 Peter 4:10-11; 1 Corinthians 14:3-5; Romans 12:6-8"] },
    { t: "Members Are Under Church Government", r: ["1 Thessalonians 5:14; 2 Thessalonians 3:6, 14-15; Matthew 18:15-17"] },
    { t: "Handling Offenses Rightly", r: ["Matthew 18:15-17; Ephesians 4:2-3"] },
    { t: "Churches Hold Communion Together", r: ["Ephesians 6:18; Psalms 122:6; Romans 16:1-2; 3 John 8-10"] },
    { t: "Associations and Their Advice", r: ["Acts 15:2, 4, 6, 22-23, 25; 2 Corinthians 1:24; 1 John 4:1"] },
  ];

  M[27] = [
    { t: "Saints Have Communion with Christ", r: ["1 John 1:3; John 1:16; Philippians 3:10; Romans 6:5-6; Ephesians 4:15-16; 1 Corinthians 12:7; 3:21-23"] },
    { t: "Saints Have Communion with One Another", r: ["Hebrews 10:24-25; Acts 2:42, 46; Isaiah 2:3; Acts 11:29-30; Galatians 6:10"] },
  ];

  M[28] = [
    { t: "Two Ordinances Appointed by Christ", r: ["Matthew 28:19-20; 1 Corinthians 11:26"] },
    { t: "Administered by Qualified Persons", r: ["Matthew 28:19; 1 Corinthians 4:1"] },
  ];

  M[29] = [
    { t: "What Baptism Signifies", r: ["Romans 6:3-5; Colossians 2:12; Galatians 3:27; Mark 1:4; Acts 22:16"] },
    { t: "The Proper Subjects of Baptism", r: ["Mark 16:16; Acts 8:36-37; 2:41; 18:8"] },
    { t: "The Element to Be Used Is Water", r: ["Matthew 28:19-20; Acts 8:38"] },
    { t: "Baptism Is by Immersion", r: ["Matthew 3:16; John 3:23; Mark 1:5, 9-10"] },
  ];

  M[30] = [
    { t: "The Supper Was Instituted by Christ", r: ["1 Corinthians 11:23-26; 10:16-17, 21"] },
    { t: "The Supper Is Not a Sacrifice for Sin", r: ["Hebrews 9:25-26, 28; 1 Corinthians 11:24; Matthew 26:26-27"] },
    { t: "The Minister Sets Apart the Elements", r: ["1 Corinthians 11:23-26; Matthew 26:26-28; Mark 14:22-24; Luke 22:19-20"] },
    { t: "Abuses of the Supper Condemned", r: ["Matthew 26:26-28; 15:9; Exodus 20:4-5"] },
    { t: "The Elements Remain Bread and Wine", r: ["1 Corinthians 11:27; 11:26-28"] },
    { t: "Transubstantiation Is Rejected", r: ["Acts 3:21; Luke 24:6, 39; 1 Corinthians 11:24-25"] },
    { t: "Worthy Receivers Feed on Christ by Faith", r: ["1 Corinthians 10:16; 11:23-26"] },
  ];

  M[31] = [
    { t: "The Soul After Death", r: ["Genesis 3:19; Acts 13:36; Ecclesiastes 12:7; Luke 23:43; 2 Corinthians 5:1, 6, 8; Philippians 1:23; Hebrews 12:23; Jude 6-7; 1 Peter 3:19; Luke 16:23-24"] },
    { t: "The Resurrection of the Body", r: ["1 Corinthians 15:51-52; 1 Thessalonians 4:17; Job 19:26-27; 1 Corinthians 15:42-43"] },
    { t: "The Just and Unjust Both Raised", r: ["Acts 24:15; John 5:28-29; Philippians 3:21"] },
  ];

  M[32] = [
    { t: "God Has Appointed a Day of Judgment", r: ["Acts 17:31; John 5:22, 27; 1 Corinthians 6:3; Jude 6; 2 Corinthians 5:10; Ecclesiastes 12:14; Matthew 12:36; Romans 14:10, 12; Matthew 25:32-46"] },
    { t: "The Purpose of the Day of Judgment", r: ["Romans 9:22-23; Matthew 25:21, 34, 46; 2 Thessalonians 1:7-10"] },
    { t: "The Day Is Unknown, So Be Watchful", r: ["2 Corinthians 5:10-11; 2 Thessalonians 1:5-7; Mark 13:35-37; Luke 12:35-40; Revelation 22:20"] },
  ];
})();
