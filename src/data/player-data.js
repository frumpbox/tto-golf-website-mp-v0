export const players = [
  {
    id: 'sam-dynes',
    displayName: "Samuel 'Dynesy' Dynes",
    fullName: null,
    dateOfBirth: null,
    height: null,
    spouse: null,
    homeClub: null,
    lowestWhsIndex: null,
    bestGrossScore: null,
    ttoDebut: null,
    candaCupDebut: null,
    bestResults: { tto: null, candaCup: null },
    background: [
      'Samuel Edward Pierre Dynes (Dynesy) is a rare breed of man with a club in his hand. Possessing an unwavering pessimism for his own game, yet palpable never say die attitude (until it’s dead), Dynesy could never be accused of not giving his all for the game.',
      'A topsy turvey day is never a surprise when Dynesy tees it up, and never has a man made the effortlessly simple seem so far away from the desperately lost just swings apart before.',
      'A true soldier on the course.'
    ],
    photo: '/images/players/sam-dynes.jpeg'
  },
  {
    id: 'felipe-milo',
    displayName: 'Felipe Milo',
    fullName: 'Felipe Milo Jr',
    dateOfBirth: '01/10/1998',
    height: '5ft7”',
    spouse: 'Lucy Woods',
    homeClub: 'None',
    lowestWhsIndex: '7.5',
    bestGrossScore: '74(+3)',
    ttoDebut: '2020',
    candaCupDebut: '2022',
    bestResults: {
      tto: 'Won – 2022 Stewarts Creek',
      candaCup: '2025 – West Sussex'
    },
    background: [
      'Born in Baguio City, Felipe was blessed from the onset with great natural sporting ability in everything except swimming. Known to rule on the ball and be a fool in the pool, Felipe’s first love was football which he played to a high standard for most of his formative years.',
      'Finding an aptitude for golf particularly at university, Felipe homed his skills at Lancaster Golf Club during term time and Tyrrell’s Wood when in the summer, making up one half of the original Tyrrell’s Wood duo with Stinton.',
      'A flare for the extraordinary has been a hallmark of Milo’s playing style, with his erratic and inconsistent ball striker and putting often saved only by his chipping, which has at times verged on the remarkable.'
    ],
    photo: '/images/players/felipe-milo.jpeg'
  },
  {
    id: 'tom-sutehall',
    displayName: 'Tom Sutehall',
    fullName: null,
    dateOfBirth: null,
    height: null,
    spouse: null,
    homeClub: null,
    lowestWhsIndex: null,
    bestGrossScore: null,
    ttoDebut: null,
    candaCupDebut: null,
    bestResults: { tto: null, candaCup: null },
    background: [
      'The tallest and orangest of the active roster, Thomas Sutehall is perhaps the hardest to nail down of the regular competitors.',
      'An aesthetic swing is offset but a roulette of a result when Ginge tees it up, meaning entertainment is never far away for his playing partners.',
      'Tom’s fondness for getting up close and personal with nature is matched only by his unorthodox approach to navigating his way back out, and God help the lads learning by his example.',
      'A true enigma of the game.'
    ],
    photo: '/images/players/tom-sutehall.jpeg'
  },
  {
    id: 'sam-lewis',
    displayName: 'Sam Lewis',
    fullName: 'Samuel Alexander Lewis',
    dateOfBirth: '09/06/1999',
    height: '5 ft 10 (nearly)',
    spouse: 'None',
    homeClub: 'Tyrrells Wood',
    lowestWhsIndex: '5.9',
    bestGrossScore: null,
    ttoDebut: 'Tyrrells Wood, 2020',
    candaCupDebut: 'Banff Springs, 2022',
    bestResults: {
      tto: 'Won : 2020, 2023, 2024',
      candaCup: '2nd : 2022'
    },
    background: [
      'Samuel (Sam) Alexander Lewis is the youngest and handsomest of the original TTO roster, boasting the most major wins and generally superb form across the years.',
      'A streaky game is underpinned by a favour for accuracy off the tee and hilariously poor irons, woeful wedge game and all or nothing approach to putting has meant Lewis may not have reached the heights he would have wanted, but form is often found when it is needed most.'
    ],
    photo: '/images/players/sam-lewis.jpeg'
  },
  {
    id: 'james-hall',
    displayName: 'James Hall',
    fullName: 'James Michael Richard Hall',
    dateOfBirth: '01/07/1997',
    height: '5 ft 10',
    spouse: 'Grace McConnell',
    homeClub: 'Carbrook',
    lowestWhsIndex: '5.1',
    bestGrossScore: null,
    ttoDebut: 'Tyrrells Wood, 2020',
    candaCupDebut: 'Banff Springs, 2022',
    bestResults: {
      tto: '2nd : 2020, 2024',
      candaCup: 'Won : East Brighton, 2024'
    },
    background: [
      'Born James Michael Richard Hall, James was only young when first exposed to the game. Son of Mark, a keen weekend golfer, and younger brother to Fraser, it is no surprise the bug caught early and persisted thereafter.',
      'His golf upbringing made Jimbo no stranger to adversity, with stories a plentiful of tantrums and arguments whilst on the course, and whilst perhaps not quite as abrasive, adversity hangs over James still in his adulthood.',
      'A very solid player in his own right, Hally boasts a strong iron and wedge game, but both ends of his bag often proving to be his downfall, with safety slice drivers and duffed putts plaguing what would otherwise be a polished game.'
    ],
    photo: '/images/players/james-hall.jpeg'
  },
  {
    id: 'george-stinton',
    displayName: 'George Stinton',
    fullName: null,
    dateOfBirth: null,
    height: null,
    spouse: null,
    homeClub: null,
    lowestWhsIndex: null,
    bestGrossScore: null,
    ttoDebut: null,
    candaCupDebut: null,
    bestResults: { tto: null, candaCup: null },
    background: [
      'Comfortably the best and only “proper” golfer of the founding fathers, George Stinton offers to TTO what the others can only dream of – legitimacy; and nothing screams legitimacy like winning a 2 day stableford tournament with 58 points.',
      'Peaking in 2025, Stinton earned many honours from his home club and annual competition alike.',
      'A pound and gouge style is typified by an outstanding wedge game, complimented nicely by a mastery of 2 foot putts.'
    ],
    photo: '/images/players/george-stinton.jpeg'
  }
];

export const playersById = Object.fromEntries(players.map((player) => [player.id, player]));
