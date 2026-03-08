/**
 * Programmatic period-authentic name generation for mystery cast members.
 *
 * Names are picked in code from curated historical pools using a seeded PRNG
 * (seeded from the runId), ensuring every run gets a fresh, varied cast
 * without relying on the LLM's statistical name biases (which tend to recycle
 * a small set of "genre-attractor" names like Inspector Harlow or Mr. Vane).
 *
 * Pools cover the full 1880–1960 range appropriate for Golden Age mystery
 * fiction. Each pool carries its own naming tradition (English gentry,
 * professional London, Scottish Lowland, Irish, Norman-French, Northern
 * English), giving cultural variety across runs while staying era-authentic.
 */

// ---------------------------------------------------------------------------
// PRNG — linear congruential generator seeded from runId hash
// ---------------------------------------------------------------------------

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer
  }
  return Math.abs(hash);
};

class LCG {
  private state: number;

  constructor(seed: number) {
    this.state = (seed >>> 0) || 1;
  }

  next(): number {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state;
  }

  /** Pick `count` distinct elements from `arr` in a random order. */
  pickUnique<T>(arr: T[], count: number): T[] {
    const pool = [...arr];
    const result: T[] = [];
    const n = Math.min(count, pool.length);
    for (let i = 0; i < n; i++) {
      const idx = this.next() % pool.length;
      result.push(pool.splice(idx, 1)[0]);
    }
    return result;
  }

  /** Fisher-Yates shuffle of an array in place. */
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.next() % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// ---------------------------------------------------------------------------
// Era stratification
// ---------------------------------------------------------------------------

type Era = 'victorian' | 'edwardian' | 'interwar' | 'postwar';

function eraFromDecade(decade?: number): Era {
  if (!decade) return 'edwardian';
  if (decade <= 1900) return 'victorian';
  if (decade <= 1910) return 'edwardian';
  if (decade <= 1939) return 'interwar';
  return 'postwar';
}

/**
 * Era-appropriate first name pools. Kept separate from surname pools so era
 * can be varied independently from the social-class / regional pool.
 */
const ERA_NAMES: Record<Era, { male: string[]; female: string[] }> = {
  victorian: {
    male: [
      'Adolphus', 'Algernon', 'Amos', 'Augustus', 'Barnabas', 'Cornelius', 'Cyrus',
      'Ebenezer', 'Elias', 'Elijah', 'Erasmus', 'Ezra', 'Horatio', 'Josiah', 'Lancelot',
      'Lemuel', 'Lucius', 'Montague', 'Mortimer', 'Nathaniel', 'Obadiah', 'Octavius',
      'Oswald', 'Phineas', 'Reginald', 'Silas', 'Solomon', 'Thaddeus', 'Theophilus',
      'Tobias', 'Valentine', 'Vivian', 'Zachariah',
    ],
    female: [
      'Agatha', 'Alberta', 'Arabella', 'Augusta', 'Bertha', 'Blanche', 'Christabel',
      'Clementine', 'Constance', 'Dorcas', 'Edith', 'Euphemia', 'Evangelina', 'Gertrude',
      'Harriet', 'Hester', 'Honoria', 'Hortensia', 'Lavinia', 'Louisa', 'Mabel',
      'Millicent', 'Muriel', 'Patience', 'Prudence', 'Selina', 'Sibyl', 'Sophronia',
      'Temperance', 'Theodora', 'Thomasina', 'Ursula', 'Winifred',
    ],
  },
  edwardian: {
    male: [
      'Alastair', 'Archibald', 'Arthur', 'Aubrey', 'Basil', 'Cecil', 'Clifford',
      'Cyril', 'Douglas', 'Edgar', 'Ernest', 'Geoffrey', 'Gerald', 'Harold', 'Herbert',
      'Horace', 'Hugh', 'Humphrey', 'Julian', 'Kenneth', 'Lawrence', 'Leonard', 'Lionel',
      'Maurice', 'Neville', 'Norman', 'Oliver', 'Percival', 'Philip', 'Ralph', 'Rodney',
      'Roger', 'Rupert', 'Sidney', 'Stanley', 'Walter', 'Wilfred',
    ],
    female: [
      'Agnes', 'Alice', 'Audrey', 'Barbara', 'Beatrice', 'Cecily', 'Clara', 'Cynthia',
      'Diana', 'Dorothea', 'Eleanor', 'Ethel', 'Florence', 'Frances', 'Hilda', 'Imogen',
      'Irene', 'Isabel', 'Josephine', 'Katherine', 'Margaret', 'Muriel', 'Nora',
      'Philippa', 'Rosalind', 'Sybil', 'Ursula', 'Violet', 'Vivienne',
    ],
  },
  interwar: {
    male: [
      'Adrian', 'Alec', 'Anthony', 'Barry', 'Brian', 'Christopher', 'Colin', 'David',
      'Desmond', 'Donald', 'Eric', 'Francis', 'Gordon', 'Graham', 'Ian', 'James',
      'John', 'Keith', 'Laurence', 'Malcolm', 'Michael', 'Neil', 'Patrick', 'Peter',
      'Raymond', 'Richard', 'Robin', 'Ronald', 'Roy', 'Stephen', 'Thomas', 'Trevor',
      'William',
    ],
    female: [
      'Angela', 'Ann', 'Audrey', 'Betty', 'Brenda', 'Carol', 'Christine', 'Dorothy',
      'Elizabeth', 'Ellen', 'Evelyn', 'Helen', 'Irene', 'Janet', 'Joan', 'Joyce',
      'June', 'Margaret', 'Marjorie', 'Mary', 'Monica', 'Nancy', 'Pamela', 'Patricia',
      'Peggy', 'Phyllis', 'Rosemary', 'Ruth', 'Sheila', 'Sylvia', 'Vera', 'Winifred',
    ],
  },
  postwar: {
    male: [
      'Alan', 'Andrew', 'Barry', 'Bernard', 'Christopher', 'Clive', 'David', 'Dennis',
      'Derek', 'Frank', 'Frederick', 'Geoffrey', 'George', 'Gordon', 'Graham', 'Harry',
      'James', 'John', 'Kenneth', 'Martin', 'Michael', 'Nicholas', 'Norman', 'Paul',
      'Peter', 'Philip', 'Raymond', 'Robert', 'Roger', 'Simon', 'Stephen', 'Timothy',
      'William',
    ],
    female: [
      'Alison', 'Ann', 'Barbara', 'Carol', 'Caroline', 'Christine', 'Claire', 'Diana',
      'Elizabeth', 'Ellen', 'Frances', 'Helen', 'Janet', 'Jennifer', 'Joan', 'Julie',
      'Karen', 'Linda', 'Margaret', 'Mary', 'Monica', 'Patricia', 'Pauline', 'Sandra',
      'Sarah', 'Sharon', 'Sheila', 'Susan', 'Valerie',
    ],
  },
};

// ---------------------------------------------------------------------------
// Name pools
// ---------------------------------------------------------------------------

interface NamePool {
  label: string;
  /** Keywords matched against location type / description to boost this pool. */
  locationSignals: string[];
  /** Keywords matched against social context / norms to boost this pool. */
  socialSignals: string[];
  maleFirst: string[];
  femaleFirst: string[];
  surnames: string[];
}

const POOLS: NamePool[] = [
  // ─── 1. English county gentry (South/Midlands landed class) ───────────────
  {
    label: 'English county gentry',
    locationSignals: ['country house', 'manor', 'estate', 'village', 'rural', 'county', 'hall', 'priory', 'grange'],
    socialSignals: ['gentry', 'aristocracy', 'landed', 'upper class', 'hereditary', 'county'],
    maleFirst: [
      'Alastair', 'Archibald', 'Aubrey', 'Basil', 'Bertram', 'Cecil', 'Clifford',
      'Cyril', 'Douglas', 'Edgar', 'Edwin', 'Ernest', 'Fabian', 'Francis', 'Frederick',
      'Geoffrey', 'Gerald', 'Gilbert', 'Harold', 'Herbert', 'Horace', 'Hugh', 'Humphrey',
      'Julian', 'Kenneth', 'Lawrence', 'Leonard', 'Lionel', 'Maurice', 'Mortimer',
      'Neville', 'Norman', 'Oliver', 'Oswald', 'Percival', 'Philip', 'Ralph', 'Reginald',
      'Rodney', 'Roger', 'Rupert', 'Sidney', 'Stanley', 'Vivian', 'Walter', 'Wilfred',
    ],
    femaleFirst: [
      'Agatha', 'Agnes', 'Alice', 'Audrey', 'Barbara', 'Beatrice', 'Blanche', 'Cecily',
      'Clara', 'Constance', 'Cynthia', 'Diana', 'Dorothea', 'Edith', 'Eleanor', 'Ethel',
      'Florence', 'Frances', 'Gertrude', 'Harriet', 'Hilda', 'Imogen', 'Irene', 'Isabel',
      'Josephine', 'Katherine', 'Lavinia', 'Mabel', 'Margaret', 'Millicent', 'Muriel',
      'Nora', 'Philippa', 'Rosalind', 'Sybil', 'Theodora', 'Ursula', 'Violet', 'Vivienne',
      'Winifred',
    ],
    surnames: [
      'Ashby', 'Atkinson', 'Barlow', 'Beverley', 'Caldwell', 'Canning', 'Chalcott',
      'Cheyne', 'Clifton', 'Colton', 'Compton', 'Corfield', 'Cromer', 'Dalton', 'Denison',
      'Elton', 'Fairfax', 'Fordham', 'Garland', 'Gilmore', 'Granger', 'Hadley', 'Hawthorn',
      'Hewitt', 'Holt', 'Horton', 'Ingram', 'Jevons', 'Kendall', 'Kibble', 'Lacey',
      'Langton', 'Latimer', 'Layton', 'Lynton', 'Marlow', 'Merton', 'Norwood', 'Pendleton',
      'Peyton', 'Pilgrim', 'Plowden', 'Rayleigh', 'Redmore', 'Ringwood', 'Rowan', 'Seaton',
      'Selby', 'Sibley', 'Skelton', 'Somerby', 'Stanton', 'Stratton', 'Sudbury', 'Tarrant',
      'Tipton', 'Tranter', 'Turnbull', 'Venables', 'Wadham', 'Waldron', 'Walton', 'Watkins',
      'Wellow', 'Wenlock', 'Whitmore', 'Wingate', 'Wollaston', 'Woodbridge', 'Worsley',
      'Wyatt', 'Wykeham',
    ],
  },

  // ─── 2. English professional / London merchant class ─────────────────────
  {
    label: 'English professional London',
    locationSignals: ['london', 'city', 'urban', 'suburban', 'town', 'office', 'chambers', 'street', 'square'],
    socialSignals: ['professional', 'merchant', 'solicitor', 'barrister', 'physician', 'banker', 'middle class', 'commerce'],
    maleFirst: [
      'Albert', 'Alfred', 'Arthur', 'Barnabas', 'Bernard', 'Clement', 'Cornelius',
      'Edmund', 'Edward', 'Elliot', 'Felix', 'Gabriel', 'George', 'Henry', 'Hubert',
      'Isaac', 'Jerome', 'Jonas', 'Jonathan', 'Joseph', 'Lewis', 'Martin', 'Nathaniel',
      'Nicholas', 'Patrick', 'Peter', 'Richard', 'Robert', 'Samuel', 'Sebastian',
      'Theodore', 'Timothy', 'Vincent', 'William',
    ],
    femaleFirst: [
      'Adelaide', 'Alexandra', 'Amelia', 'Arabella', 'Caroline', 'Charlotte', 'Christina',
      'Clarissa', 'Deborah', 'Elisabeth', 'Ellen', 'Emily', 'Emma', 'Eugenia', 'Felicity',
      'Georgia', 'Henrietta', 'Jane', 'Julia', 'Lydia', 'Madeline', 'Marianne', 'Matilda',
      'Miranda', 'Miriam', 'Penelope', 'Rebecca', 'Sophia', 'Susan', 'Victoria', 'Virginia',
    ],
    surnames: [
      'Alderton', 'Atwell', 'Barnard', 'Burford', 'Calloway', 'Carver', 'Chilton', 'Cobham',
      'Collingwood', 'Cordell', 'Cotton', 'Crane', 'Craven', 'Croft', 'Dakin', 'Danby',
      'Devlin', 'Dickson', 'Dinsmore', 'Drew', 'Dudley', 'Dunn', 'Eastwood', 'Edgerton',
      'Fairfield', 'Falconer', 'Farlow', 'Fawcett', 'Featherstone', 'Fenwick', 'Ferris',
      'Finch', 'Foxton', 'Galloway', 'Gamble', 'Garvey', 'Golding', 'Goodman', 'Grantham',
      'Hallam', 'Hamlyn', 'Hampden', 'Hardwick', 'Hazeldine', 'Hedges', 'Heron', 'Holgate',
      'Holman', 'Hornsey', 'Hoskins', 'Ireton', 'Jarvis', 'Keene', 'Kirkland', 'Kitson',
      'Lassiter', 'Lawson', 'Lenton', 'Linton', 'Livesey', 'Lowther', 'Mallory', 'Manning',
      'Medway', 'Midgley', 'Milner', 'Moorfield', 'Moreton', 'Mortlock', 'Newbury', 'Norton',
      'Oakley', 'Orton', 'Padgett', 'Palgrave', 'Palliser', 'Parkins', 'Paston', 'Penrose',
      'Perkins', 'Phelps', 'Potts', 'Prior', 'Proctor', 'Purnell', 'Radcliff', 'Ramsey',
      'Rawson', 'Rhodes', 'Riggs', 'Ripley', 'Robson', 'Sandford', 'Sansom', 'Sawyer',
      'Sheldon', 'Shore', 'Sibson', 'Skinner', 'Sloane', 'Smallwood', 'Smythe', 'Soames',
      'Sorrell', 'Southgate', 'Standish', 'Statham', 'Stockton', 'Storey', 'Stratford',
      'Stringer', 'Sumner', 'Sutton', 'Swann', 'Swinburne',
    ],
  },

  // ─── 3. Scottish Lowland merchant/professional class ─────────────────────
  {
    label: 'Scottish Lowland',
    locationSignals: ['scotland', 'scottish', 'edinburgh', 'glasgow', 'highland', 'loch', 'glen', 'moor', 'castle'],
    socialSignals: ['scottish', 'kirk', 'presbyterian', 'lowland', 'highland', 'clan'],
    maleFirst: [
      'Alasdair', 'Angus', 'Callum', 'Cameron', 'Colin', 'Donald', 'Dougal', 'Duncan',
      'Euan', 'Farquhar', 'Fergus', 'Finlay', 'Gavin', 'Gordon', 'Hamish', 'Ian',
      'Iain', 'Jamie', 'Kenneth', 'Lachlan', 'Malcolm', 'Murray', 'Neil', 'Rory', 'Ross',
      'Stuart',
    ],
    femaleFirst: [
      'Agnes', 'Anne', 'Catriona', 'Christina', 'Eilidh', 'Elizabeth', 'Fiona', 'Flora',
      'Helen', 'Ishbel', 'Jane', 'Janet', 'Jean', 'Jessie', 'Kirsty', 'Maggie', 'Marion',
      'Mary', 'Morag', 'Morna', 'Morven', 'Nan', 'Norah', 'Rona', 'Sheena', 'Una', 'Violet',
    ],
    surnames: [
      'Baird', 'Ballantyne', 'Bowman', 'Bryce', 'Buchanan', 'Calder', 'Callander',
      'Christie', 'Crichton', 'Dalglish', 'Dunbar', 'Dundas', 'Erskine', 'Farquharson',
      'Fergusson', 'Findlay', 'Fotheringham', 'Gillespie', 'Glennie', 'Gunn', 'Halliday',
      'Irvine', 'Lamont', 'Lochhead', 'Lumsden', 'MacAulay', 'MacCrimmon', 'Macfarlane',
      'Mackintosh', 'Melville', 'Menzies', 'Moir', 'Nairn', 'Ogilvy', 'Primrose', 'Ramsay',
      'Rattray', 'Riddell', 'Roberton', 'Ruthven', 'Scrymgeour', 'Sempill', 'Shedden',
      'Sinclair', 'Spalding', 'Speirs', 'Stirling', 'Tait', 'Tulloch', 'Urquhart', 'Veitch',
      'Waddell', 'Wedderburn', 'Whitelaw', 'Wishart',
    ],
  },

  // ─── 4. Irish and Anglo-Irish ─────────────────────────────────────────────
  {
    label: 'Irish and Anglo-Irish',
    locationSignals: ['ireland', 'irish', 'dublin', 'cork', 'county', 'bog', 'castle ireland'],
    socialSignals: ['catholic', 'protestant ireland', 'irish', 'ascendancy', 'nationalist'],
    maleFirst: [
      'Aidan', 'Arthur', 'Brendan', 'Cathal', 'Charles', 'Ciaran', 'Colm', 'Cormac',
      'Declan', 'Diarmuid', 'Eamon', 'Edward', 'Fionn', 'Francis', 'George', 'Henry',
      'James', 'John', 'Kieran', 'Lorcan', 'Michael', 'Niall', 'Padraig', 'Patrick',
      'Richard', 'Rory', 'Ronan', 'Seamus', 'Sean', 'Tadhg', 'Thomas', 'William',
    ],
    femaleFirst: [
      'Aoife', 'Bridget', 'Caoimhe', 'Caroline', 'Catherine', 'Ciara', 'Clodagh',
      'Deirdre', 'Dorothy', 'Eileen', 'Elizabeth', 'Emily', 'Fionnuala', 'Frances',
      'Grainne', 'Helen', 'Honora', 'Jane', 'Julia', 'Kathleen', 'Louisa', 'Mairead',
      'Mary', 'Maud', 'Maura', 'Nora', 'Nuala', 'Orla', 'Roisin', 'Siobhan', 'Sorcha',
    ],
    surnames: [
      'Boyle', 'Brady', 'Burke', 'Byrne', 'Cahill', 'Carroll', 'Casey', 'Clancy',
      'Collins', 'Connelly', 'Conway', 'Cooney', 'Crowe', 'Cullen', 'Daly', 'Delaney',
      'Dempsey', 'Doyle', 'Duffy', 'Dunne', 'Enright', 'Farrell', 'Flanagan', 'Flynn',
      'Foley', 'Gallagher', 'Griffin', 'Hayes', 'Healy', 'Hogan', 'Kane', 'Kavanagh',
      'Keane', 'Kehoe', 'Larkin', 'Lawlor', 'Leahy', 'Lynch', 'Madden', 'Maguire',
      'McCarthy', 'McGrath', 'McKenna', 'McNamara', 'Meagher', 'Molloy', 'Monaghan',
      'Moran', 'Moriarty', 'Mulcahy', 'Murphy', 'Nolan', "O'Brien", "O'Connell",
      "O'Connor", "O'Donnell", "O'Driscoll", "O'Leary", "O'Malley", "O'Rourke",
      "O'Sullivan", 'Phelan', 'Power', 'Quigley', 'Quirke', 'Regan', 'Riordan', 'Ryan',
      'Scanlon', 'Shaughnessy', 'Sheehan', 'Sheridan', 'Slattery', 'Sullivan', 'Tobin',
      'Walsh',
    ],
  },

  // ─── 5. Norman-French descent (British families with French surnames) ─────
  {
    label: 'Norman-French descent',
    locationSignals: ['country house', 'manor', 'estate', 'hall', 'court', 'priory', 'abbey'],
    socialSignals: ['aristocracy', 'gentry', 'old family', 'hereditary', 'peerage', 'titled'],
    maleFirst: [
      'Auberon', 'Bernard', 'Charles', 'Clement', 'Felix', 'Gaston', 'Gervaise',
      'Godfrey', 'Guy', 'Henri', 'Hubert', 'Jerome', 'Leon', 'Louis', 'Lucien',
      'Marcel', 'Maurice', 'Noel', 'Philippe', 'Raoul', 'Rene', 'Roland', 'Tristan',
    ],
    femaleFirst: [
      'Adele', 'Adrienne', 'Amelie', 'Antoinette', 'Aurelie', 'Blanche', 'Camille',
      'Celeste', 'Claudine', 'Colette', 'Delphine', 'Elise', 'Emmeline', 'Genevieve',
      'Helene', 'Isabelle', 'Jacqueline', 'Juliette', 'Louise', 'Marguerite', 'Mathilde',
      'Pauline', 'Simone', 'Solange', 'Therese', 'Yvette', 'Yvonne',
    ],
    surnames: [
      'Beauchamp', 'Beaumont', 'Beresford', 'Brabazon', 'Chevalier', 'Corbet', 'Courtenay',
      'Daubeny', 'Delacroix', 'Devereux', 'Drury', 'Ferrers', 'Lacy', 'Latour', 'Lisle',
      'Lovell', 'Mandeville', 'Martel', 'Mowbray', 'Paynter', 'Peverel', 'Playfair',
      'Quincy', 'Rochford', 'Somerville', 'Tracy', 'Tregothnan', 'Vautier', 'Vaux',
      'Villiers', 'Waldegrave', 'Warenne', 'Willoughby',
    ],
  },

  // ─── 6. Northern English industrial/Nonconformist class ──────────────────
  {
    label: 'Northern English industrial',
    locationSignals: ['mill', 'factory', 'mill town', 'yorkshire', 'lancashire', 'manchester', 'leeds', 'bradford', 'sheffield', 'northern'],
    socialSignals: ['nonconformist', 'methodist', 'chapel', 'industrial', 'mill owner', 'working class', 'factory'],
    maleFirst: [
      'Albert', 'Amos', 'Arthur', 'Benjamin', 'Caleb', 'Eli', 'Enoch', 'Ernest',
      'George', 'Herbert', 'Isaac', 'Isaiah', 'Jabez', 'Jeremiah', 'Job', 'Jonas',
      'Joshua', 'Josiah', 'Leonard', 'Nathan', 'Nehemiah', 'Seth', 'Silas', 'Thomas',
      'Walter', 'William', 'Zachariah',
    ],
    femaleFirst: [
      'Ada', 'Annie', 'Bertha', 'Clara', 'Edna', 'Elsie', 'Emmeline', 'Enid', 'Ethel',
      'Gertrude', 'Hannah', 'Hilda', 'Ivy', 'Janet', 'Lottie', 'Maud', 'Minnie', 'Nellie',
      'Ruth', 'Sally', 'Selina', 'Susan', 'Tabitha', 'Winnie',
    ],
    surnames: [
      'Ainsworth', 'Ackroyd', 'Appleyard', 'Armitage', 'Backhouse', 'Barraclough', 'Battye',
      'Binns', 'Bottomley', 'Briggs', 'Broadbent', 'Butterfield', 'Chadwick', 'Clegg',
      'Coates', 'Cockroft', 'Crabtree', 'Crossley', 'Denton', 'Earnshaw', 'Exley', 'Firth',
      'Garlick', 'Gill', 'Gledhill', 'Greenwood', 'Haigh', 'Hallas', 'Hampson', 'Hardcastle',
      'Haworth', 'Higham', 'Holroyd', 'Hoyle', 'Illingworth', 'Jessop', 'Jowett', 'Kershaw',
      'Lister', 'Lockwood', 'Longbottom', 'Marsden', 'Mellor', 'Moorhouse', 'Nutter', 'Ogden',
      'Oldham', 'Pickles', 'Priestley', 'Ramsden', 'Rayner', 'Redfearn', 'Schofield',
      'Shuttleworth', 'Slater', 'Sugden', 'Sykes', 'Tattersall', 'Threlfall', 'Townend',
      'Varley', 'Wadsworth', 'Whiteley', 'Whitworth', 'Wigglesworth', 'Wilkinson', 'Wolfenden',
    ],
  },

  // ─── 7. English rural / village tradespeople ─────────────────────────────
  {
    label: 'English rural village',
    locationSignals: ['village', 'hamlet', 'farm', 'inn', 'cottage', 'market town', 'parish', 'church', 'mill', 'forge'],
    socialSignals: ['tradesperson', 'farmer', 'innkeeper', 'shopkeeper', 'craftsman', 'artisan', 'rural working'],
    maleFirst: [
      'Abel', 'Abraham', 'Amos', 'Benjamin', 'Caleb', 'Dan', 'Eli', 'Elias', 'Elijah',
      'Ernest', 'George', 'Harry', 'Henry', 'Herbert', 'Isaac', 'Jacob', 'James', 'Job',
      'John', 'Jonas', 'Joseph', 'Joshua', 'Matthew', 'Nathan', 'Samuel', 'Seth', 'Simon',
      'Solomon', 'Thomas', 'Timothy', 'Walter', 'William',
    ],
    femaleFirst: [
      'Ada', 'Annie', 'Bess', 'Betty', 'Clara', 'Edna', 'Elsie', 'Emmeline', 'Enid',
      'Florrie', 'Grace', 'Hannah', 'Ivy', 'Lottie', 'Lucy', 'Maud', 'Minnie', 'Molly',
      'Nellie', 'Phoebe', 'Polly', 'Rose', 'Ruth', 'Sally', 'Susan', 'Tabitha', 'Winnie',
    ],
    surnames: [
      'Badcock', 'Barker', 'Bricknell', 'Broadhurst', 'Buckley', 'Bullock', 'Bunce',
      'Burgess', 'Butcher', 'Cheetham', 'Chitty', 'Cobbett', 'Cobden', 'Collis', 'Cope',
      'Cotterell', 'Craddock', 'Crisp', 'Crossman', 'Draper', 'Dyson', 'Farr', 'Finney',
      'Fletcher', 'Forster', 'Gale', 'Goff', 'Gooch', 'Goodchild', 'Goodfellow', 'Gould',
      'Grubb', 'Guest', 'Hackett', 'Hagger', 'Hammond', 'Harker', 'Hatch', 'Hawkes',
      'Haywood', 'Hedger', 'Higgins', 'Hobbs', 'Hodge', 'Holley', 'Honeywood', 'Hooper',
      'Horne', 'Hudson', 'Hyatt', 'Kemp', 'Knapp', 'Lamb', 'Lambert', 'Lark', 'Leavis',
      'Luck', 'Mace', 'Marsh', 'Masters', 'Monk', 'Moody', 'Munday', 'Newland', 'Noakes',
      'Norris', 'Osborne', 'Payne', 'Peck', 'Plumb', 'Pope', 'Pratt', 'Pullen', 'Read',
      'Robbins', 'Roper', 'Rudge', 'Sands', 'Sherwood', 'Silk', 'Simms', 'Skeet', 'Slack',
      'Smart', 'Snell', 'Sparks', 'Sparrow', 'Steed', 'Stride', 'Strong', 'Stubbs',
      'Swift', 'Tanner', 'Thorne', 'Thurlow', 'Todd', 'Tomlin', 'Tucker', 'Turner',
      'Twigg', 'Vickers', 'Wake', 'Ward', 'Watts', 'Webb', 'Wells', 'Whiting', 'Wills',
      'Winter', 'Wood', 'Wren', 'Young',
    ],
  },

  // ─── 8. Welsh ─────────────────────────────────────────────────────────────
  {
    label: 'Welsh',
    locationSignals: ['wales', 'welsh', 'cardiff', 'swansea', 'valley', 'colliery', 'snowdon', 'anglesey', 'brecon'],
    socialSignals: ['welsh', 'chapel', 'nonconformist wales', 'mining', 'methodist wales'],
    maleFirst: [
      'Alun', 'Aneurin', 'Arthur', 'Caradoc', 'Dafydd', 'David', 'Dylan', 'Emlyn',
      'Emrys', 'Evan', 'Gareth', 'Geraint', 'Glyn', 'Gwilym', 'Huw', 'Idris',
      'Ieuan', 'Ifor', 'Islwyn', 'Llywelyn', 'Meredith', 'Morgan', 'Owen', 'Rhys',
      'Tudor', 'William', 'Wyn',
    ],
    femaleFirst: [
      'Angharad', 'Bethan', 'Bronwen', 'Catrin', 'Ceridwen', 'Elan', 'Elin', 'Ffion',
      'Gwen', 'Gwenllian', 'Lowri', 'Mair', 'Mari', 'Megan', 'Morfudd', 'Nerys',
      'Nest', 'Nia', 'Olwen', 'Rhiannon', 'Seren', 'Tegwen', 'Winifred',
    ],
    surnames: [
      'Bevan', 'Bowen', 'Daniel', 'Davies', 'Edwards', 'Ellis', 'Evans', 'Griffiths',
      'Gwyn', 'Howells', 'Hughes', 'Humphreys', 'James', 'Jenkins', 'Jones', 'Lewis',
      'Lloyd', 'Llewellyn', 'Matthews', 'Morgan', 'Morris', 'Owen', 'Phillips', 'Powell',
      'Price', 'Prichard', 'Prosser', 'Pugh', 'Rees', 'Richards', 'Roberts', 'Rogers',
      'Thomas', 'Vaughan', 'Watkins', 'Williams', 'Wynne',
    ],
  },

  // ─── 9. Jewish-British ────────────────────────────────────────────────────
  {
    label: 'Jewish-British',
    locationSignals: ['east end', 'whitechapel', 'golders green', 'london', 'city'],
    socialSignals: ['jewish', 'synagogue', 'merchant', 'jeweller', 'tailor', 'financier'],
    maleFirst: [
      'Aaron', 'Abraham', 'Benjamin', 'Cyrus', 'Daniel', 'David', 'Elias', 'Emanuel',
      'Ezra', 'Gabriel', 'Gideon', 'Hyam', 'Isaac', 'Israel', 'Jacob', 'Joseph',
      'Julius', 'Lazarus', 'Levi', 'Marcus', 'Marks', 'Michael', 'Moses', 'Nathan',
      'Nathaniel', 'Philip', 'Reuben', 'Samuel', 'Saul', 'Simeon', 'Solomon',
    ],
    femaleFirst: [
      'Ada', 'Deborah', 'Esther', 'Eva', 'Hannah', 'Leah', 'Miriam', 'Naomi',
      'Rachel', 'Rebecca', 'Ruth', 'Sarah', 'Tamar',
    ],
    surnames: [
      'Abrahams', 'Barnett', 'Blum', 'Cohen', 'Cohn', 'Davis', 'Dreyfus', 'Feldman',
      'Feinberg', 'Goldberg', 'Goldman', 'Goldstein', 'Goodman', 'Green', 'Greenbaum',
      'Greenberg', 'Hart', 'Hertz', 'Jacobs', 'Jacobson', 'Kahn', 'Kaufman', 'Klein',
      'Lazarus', 'Levi', 'Levin', 'Levine', 'Levy', 'Lewis', 'Lipman', 'Lipson',
      'Marks', 'Mendel', 'Mendelsohn', 'Meyer', 'Michaels', 'Nathan', 'Phillips',
      'Pincus', 'Raphael', 'Rosenthal', 'Roth', 'Rothschild', 'Rubens', 'Rubinstein',
      'Samuel', 'Samuels', 'Schwarz', 'Selig', 'Simons', 'Solomon', 'Stein', 'Stern',
      'Strauss', 'Weiss', 'Wolf', 'Wolff', 'Wolfson', 'Woolf',
    ],
  },

  // ─── 10. Cornish / West Country ───────────────────────────────────────────
  {
    label: 'Cornish and West Country',
    locationSignals: ['cornwall', 'cornish', 'devon', 'dorset', 'somerset', 'coast', 'cove', 'cliff', 'harbour', 'fishing village', 'west country', 'moor', 'dartmoor', 'exmoor'],
    socialSignals: ['fishing', 'mining cornish', 'smuggling', 'coastal', 'local landowner', 'dissenter'],
    maleFirst: [
      'Arthur', 'Cador', 'Constantine', 'Conan', 'Denis', 'Enys', 'Geoffrey', 'Geraint',
      'Griffith', 'Henry', 'Hugh', 'Humphrey', 'James', 'John', 'Mervyn', 'Morgan',
      'Nicholas', 'Pasco', 'Petroc', 'Richard', 'Robert', 'Roger', 'Stephen', 'Thomas',
      'Tristram', 'Vivian', 'Walter', 'Warrick', 'William',
    ],
    femaleFirst: [
      'Ailla', 'Blejan', 'Carenza', 'Demelza', 'Elowen', 'Eseld', 'Gweniver', 'Isolde',
      'Jenifer', 'Jenna', 'Kerensa', 'Lowena', 'Meliora', 'Morwenna', 'Nessa',
      'Rosen', 'Senara', 'Tamsin', 'Tegen', 'Una', 'Wenna',
    ],
    surnames: [
      'Angove', 'Annear', 'Baragwanath', 'Benny', 'Bolitho', 'Bosanko', 'Bosustow',
      'Bottrell', 'Carew', 'Carlyon', 'Chegwin', 'Chynoweth', 'Clemo', 'Colenso',
      'Curnow', 'Davy', 'Doney', 'Dunstan', 'Gaved', 'Gendall', 'Gilbert', 'Gluyas',
      'Hocking', 'Hoskin', 'Hugo', 'Jenkin', 'Knuckey', 'Lawry', 'Lean', 'Liddicoat',
      'Luke', 'Maddern', 'Mitchell', 'Nancarrow', 'Nance', 'Nicholls', 'Opie', 'Pasco',
      'Pengelly', 'Penrose', 'Petherick', 'Polglase', 'Polkinghorne', 'Prideaux',
      'Quick', 'Rowe', 'Semmens', 'Stephens', 'Tallack', 'Tamblyn', 'Tangye', 'Teague',
      'Tippett', 'Tregear', 'Treloar', 'Tremayne', 'Trembath', 'Tresidder', 'Trewin',
      'Trevithick', 'Trounson', 'Vivian',
    ],
  },

  // ─── 11. Colonial returned / Empire service ───────────────────────────────
  {
    label: 'Colonial returned',
    locationSignals: ['india', 'burma', 'africa', 'colonial', 'empire', 'plantation', 'regiment', 'cantonment'],
    socialSignals: ['retired colonel', 'indian civil service', 'planter', 'colonial administrator', 'military', 'anglo-indian', 'empire'],
    maleFirst: [
      'Alastair', 'Archibald', 'Arthur', 'Basil', 'Cecil', 'Charles', 'Claude',
      'Clive', 'Douglas', 'Dudley', 'Edward', 'Ernest', 'Felix', 'Francis', 'Frederick',
      'Geoffrey', 'George', 'Gerald', 'Godfrey', 'Harold', 'Herbert', 'Hugh', 'Humphrey',
      'Julian', 'Lionel', 'Maurice', 'Montague', 'Norman', 'Oswald', 'Percival',
      'Philip', 'Ralph', 'Reginald', 'Richard', 'Robert', 'Rupert', 'Sidney', 'Victor',
      'Vivian', 'Walter', 'Wilfred', 'William',
    ],
    femaleFirst: [
      'Adelaide', 'Alice', 'Beatrice', 'Cecily', 'Constance', 'Daphne', 'Diana',
      'Edith', 'Eleanor', 'Florence', 'Frances', 'Harriet', 'Helen', 'Hilda', 'Imogen',
      'Isabel', 'Josephine', 'Katherine', 'Lavinia', 'Mabel', 'Margaret', 'Muriel',
      'Nora', 'Philippa', 'Rosalind', 'Sybil', 'Ursula', 'Violet', 'Winifred',
    ],
    surnames: [
      'Armitage', 'Ashton', 'Atkins', 'Barton', 'Birch', 'Blakely', 'Blundell', 'Bourne',
      'Brandon', 'Brett', 'Britton', 'Brook', 'Broome', 'Bryant', 'Burnet', 'Burton',
      'Carlton', 'Cavendish', 'Chaloner', 'Chandler', 'Chaplin', 'Chester', 'Clarkson',
      'Clifford', 'Collier', 'Colston', 'Conway', 'Cooke', 'Cooper', 'Copley', 'Corbet',
      'Cotton', 'Courtenay', 'Crane', 'Crawford', 'Curzon', 'Dalton', 'Darby', 'Dashwood',
      'Dawson', 'Deane', 'Denning', 'Dixon', 'Dormer', 'Drummond', 'Duff', 'Duncan',
      'Dutton', 'Eaton', 'Elliott', 'Ellis', 'Emerson', 'Erskine', 'Fairfax', 'Farrant',
      'Faulkner', 'Fellowes', 'Fenton', 'Ferguson', 'Finch', 'Fisher', 'Fitzroy',
      'Fleming', 'Fletcher', 'Forbes', 'Forster', 'Fortescue', 'Foster', 'Fox', 'Frazer',
      'Fulton', 'Galton', 'Gascoigne', 'Gibson', 'Gilmour', 'Gordon', 'Grant', 'Granville',
      'Graves', 'Gray', 'Grenville', 'Grigg', 'Hamilton', 'Hampton', 'Harcourt', 'Hardy',
      'Hargreaves', 'Harris', 'Harrison', 'Hartley', 'Harvey', 'Hastings', 'Hawkins',
      'Heath', 'Henderson', 'Herbert', 'Hill', 'Hoare', 'Holland', 'Holmwood', 'Holt',
      'Horton', 'Howard', 'Hudson', 'Hunt', 'Hunter', 'Hurst',
    ],
  },
];

// ---------------------------------------------------------------------------
// Context-aware pool selection
// ---------------------------------------------------------------------------

/**
 * Setting context from Agent 1 output, used to weight name pool selection.
 * All fields are optional; omitting them falls back to uniform random selection.
 */
export interface NameGeneratorContext {
  /** Story decade (e.g. 1920, 1935). Used to pick era-appropriate first names. */
  decade?: number;
  /** Location type from setting (e.g. "country house", "village", "london"). */
  locationType?: string;
  /** Full location description from setting, searched for additional signals. */
  locationDescription?: string;
  /** Social context / norms string from setting, searched for social signals. */
  socialContext?: string;
}

/**
 * Score each pool against the provided context.
 * Each matching signal adds 2 points; no signals defaults to base score of 1
 * so every pool retains a small chance of selection even when not signalled.
 */
function scorePoolsForContext(ctx: NameGeneratorContext): number[] {
  const loc = `${ctx.locationType ?? ''} ${ctx.locationDescription ?? ''}`.toLowerCase();
  const soc = (ctx.socialContext ?? '').toLowerCase();

  return POOLS.map((pool) => {
    let score = 1; // base — always selectable
    for (const sig of pool.locationSignals) {
      if (loc.includes(sig)) score += 2;
    }
    for (const sig of pool.socialSignals) {
      if (soc.includes(sig)) score += 2;
    }
    return score;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate `count` period-authentic full names for a mystery cast.
 *
 * Names are picked deterministically from curated historical pools using a
 * seeded PRNG, so the same runId always produces the same names, but
 * different runs produce genuinely different casts.
 *
 * When `context` is supplied (from Agent 1 setting output), pool selection is
 * weighted by location and social signals, and first names are blended from
 * the pool's own list (2× weight) plus an era-appropriate bucket derived from
 * the story decade.
 *
 * Gender is distributed roughly half-and-half (randomised per run).
 *
 * @param runId   - The run identifier used to seed the PRNG.
 * @param count   - How many names to generate (total cast size incl. detective).
 * @param context - Optional setting context from Agent 1 output.
 * @returns Array of full names e.g. `["Harriet Wellow", "Cecil Ackroyd", ...]`
 */
export function generateCastNames(
  runId: string,
  count: number,
  context?: NameGeneratorContext,
): string[] {
  const hash = simpleHash(runId || 'default');
  const rng = new LCG(hash);

  // ── Select pool ────────────────────────────────────────────────────────────
  let pool: NamePool;
  if (context && (context.locationType || context.locationDescription || context.socialContext)) {
    const weights = scorePoolsForContext(context);
    const total = weights.reduce((s, w) => s + w, 0);
    let pick = rng.next() % total;
    let idx = 0;
    for (; idx < weights.length - 1; idx++) {
      if (pick < weights[idx]) break;
      pick -= weights[idx];
    }
    pool = POOLS[idx];
  } else {
    pool = POOLS[rng.next() % POOLS.length];
  }

  // ── Build era-blended first-name lists ────────────────────────────────────
  const era = eraFromDecade(context?.decade);
  const eraNames = ERA_NAMES[era];

  // Pool names at 2× weight + era names at 1× weight, deduped.
  const maleFirstBlended = [
    ...pool.maleFirst, ...pool.maleFirst,
    ...eraNames.male,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const femaleFirstBlended = [
    ...pool.femaleFirst, ...pool.femaleFirst,
    ...eraNames.female,
  ].filter((v, i, a) => a.indexOf(v) === i);

  // ── Gender split ──────────────────────────────────────────────────────────
  const maleCount = rng.next() % 2 === 0 ? Math.ceil(count / 2) : Math.floor(count / 2);
  const femaleCount = count - maleCount;

  const maleFirsts = rng.pickUnique(maleFirstBlended, maleCount);
  const femaleFirsts = rng.pickUnique(femaleFirstBlended, femaleCount);
  const allFirsts = rng.shuffle([...maleFirsts, ...femaleFirsts]);

  // ── Surnames — spill to adjacent pool if needed ───────────────────────────
  let surnames = rng.pickUnique(pool.surnames, count);
  if (surnames.length < count) {
    const poolIdx = POOLS.indexOf(pool);
    const nextPool = POOLS[(poolIdx + 1) % POOLS.length];
    const extra = rng.pickUnique(nextPool.surnames, count - surnames.length);
    surnames = [...surnames, ...extra];
  }

  return allFirsts.map((first, i) => `${first} ${surnames[i]}`);
}
