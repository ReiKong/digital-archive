export type ArchiveItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  place: string;
  note: string;
  image: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  z: number;
};

const entries: Omit<ArchiveItem, 'image'>[] = [
  { id:'01',title:'A ticket from another night',category:'EPHEMERA',year:'2024',place:'Montréal, QC',note:'A small piece of paper that somehow remembers more than I do. I kept it in the back of a book.',x:90,y:135,width:132,rotation:-6,z:2 },
  { id:'02',title:'Almost-summer postcard',category:'POSTCARDS',year:'2023',place:'New York, NY',note:'Found in a little shop on an afternoon I had nowhere in particular to be.',x:275,y:78,width:169,rotation:4,z:1 },
  { id:'03',title:'The little silver camera',category:'OBJECTS',year:'2022',place:'Toronto, ON',note:'Scratched corners, questionable battery, and a memory card full of the mundane.',x:504,y:168,width:145,rotation:8,z:3 },
  { id:'04',title:'Pressed buttercup',category:'BOTANICALS',year:'2024',place:'Montréal, QC',note:'Pressed between two pages and forgotten until the following winter.',x:741,y:64,width:115,rotation:-7,z:2 },
  { id:'05',title:'The blue cassette',category:'MUSIC',year:'2021',place:'Chicago, IL',note:'Songs that seemed to belong to a very specific version of myself.',x:933,y:200,width:146,rotation:7,z:2 },
  { id:'06',title:'Photo booth strip',category:'PHOTOGRAPHS',year:'2023',place:'Singapore',note:'Four frames, one very ordinary afternoon, a lot of laughter.',x:1104,y:34,width:100,rotation:-8,z:3 },
  { id:'07',title:'A train receipt',category:'EPHEMERA',year:'2025',place:'Hong Kong',note:'Proof that I was there, even if I can no longer remember the exact day.',x:1330,y:153,width:121,rotation:3,z:2 },
  { id:'08',title:'Small brass key',category:'OBJECTS',year:'2020',place:'Chicago, IL',note:'It no longer opens anything I know of. I keep it anyway.',x:1560,y:72,width:115,rotation:-7,z:2 },
  { id:'09',title:'A paper moon',category:'PRINTS',year:'2022',place:'Montréal, QC',note:'A print picked up at a weekend market. It has moved with me ever since.',x:1800,y:212,width:153,rotation:5,z:2 },
  { id:'10',title:'Little orange matchbox',category:'EPHEMERA',year:'2024',place:'New York, NY',note:'Something bright to bring home from a place I wanted to return to.',x:360,y:419,width:113,rotation:-11,z:5 },
  { id:'11',title:'Somewhere by the sea',category:'PHOTOGRAPHS',year:'2025',place:'Hong Kong',note:'An accidental photograph that feels more like a memory than the intentional ones.',x:119,y:548,width:172,rotation:5,z:2 },
  { id:'12',title:'A tiny pressed leaf',category:'BOTANICALS',year:'2023',place:'Montréal, QC',note:'Picked up on the long way home, tucked into an old notebook.',x:615,y:468,width:110,rotation:9,z:3 },
  { id:'13',title:'An old mixtape',category:'MUSIC',year:'2021',place:'Toronto, ON',note:'A track list in handwriting I barely recognize.',x:835,y:504,width:166,rotation:-5,z:4 },
  { id:'14',title:'Cafe receipt, 4:32 PM',category:'EPHEMERA',year:'2025',place:'Singapore',note:'A receipt I meant to throw away. Somehow it became an artifact.',x:1078,y:420,width:105,rotation:8,z:2 },
  { id:'15',title:'A paper flower',category:'BOTANICALS',year:'2022',place:'Montréal, QC',note:'The shape and color have faded, but the reason I kept it has not.',x:1445,y:476,width:130,rotation:-5,z:2 },
  { id:'16',title:'A ticket to nowhere',category:'EPHEMERA',year:'2026',place:'New York, NY',note:'The kind of ordinary little paper that feels special only later.',x:1754,y:566,width:149,rotation:4,z:3 },
  { id:'17',title:'The postcard with no address',category:'POSTCARDS',year:'2020',place:'Chicago, IL',note:'A postcard that never got mailed, with nowhere to go and no deadline.',x:2010,y:340,width:166,rotation:-7,z:2 },
  { id:'18',title:'Window seat photograph',category:'PHOTOGRAPHS',year:'2025',place:'Hong Kong',note:'A small view of a very large city. I still remember the light.',x:2210,y:90,width:155,rotation:6,z:2 },
  { id:'19',title:'A tiny notebook',category:'OBJECTS',year:'2023',place:'Montréal, QC',note:'Pages of unfinished lists, pressed corners, ideas that never quite happened.',x:250,y:827,width:140,rotation:5,z:2 },
  { id:'20',title:'Flowers on film',category:'PHOTOGRAPHS',year:'2024',place:'Toronto, ON',note:'A blurred frame from a roll that took me a year to develop.',x:653,y:852,width:166,rotation:-6,z:3 },
  { id:'21',title:'Paper constellation',category:'PRINTS',year:'2022',place:'Chicago, IL',note:'Folded carefully into a suitcase, unfolded in another city.',x:1110,y:820,width:149,rotation:7,z:2 },
  { id:'22',title:'The green stamp',category:'EPHEMERA',year:'2025',place:'Singapore',note:'Too pretty to stick on an envelope. Small enough to misplace.',x:1537,y:898,width:98,rotation:-9,z:4 },
  { id:'23',title:'Dried wildflowers',category:'BOTANICALS',year:'2024',place:'Montréal, QC',note:'A very small bouquet for a very ordinary day.',x:1960,y:886,width:128,rotation:3,z:3 },
  { id:'24',title:'Cinema stub',category:'EPHEMERA',year:'2023',place:'Toronto, ON',note:'An evening worth keeping a piece of.',x:2350,y:707,width:150,rotation:-4,z:2 }
];
export const INITIAL_ITEMS: ArchiveItem[] = entries.map((entry, index) => ({ ...entry, image: `/images/${String(index + 1).padStart(2, '0')}.svg` }));
