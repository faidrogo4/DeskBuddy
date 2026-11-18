/**
 * Frequent English words of six or more letters, offered as completions after
 * words from the open document. Shorter words save too few keystrokes to be
 * worth a popup. Roughly ordered by frequency; order breaks ties.
 */
export const COMMON_ENGLISH_WORDS: readonly string[] = [
  ...new Set(
    `
because should through people before between something different another
however important example without around following during including within
against already children business information government without problem
company system program question number however service through report
member public believe probably actually several particular general possible
national become better change country develop family friend history
interest little mother office person political president process provide
reason research result school social student support whether thought though
understand various certain community consider continue control describe
experience include increase market minute moment others period policy
position present product program project rather really remember require
return second simple simply single spend strong sometimes special suggest
together toward travel without within wonder writer yourself available
activity actually address agreement although analysis approach argument
article attention audience authority average beautiful behavior behind
benefit beyond budget building campaign capital career center challenge
character chance choice citizen client collection college commercial
common compare computer concern condition conference contain content
context contract conversation course create crisis culture current customer
damage database decade decide decision defense degree department
design despite detail determine difference difficult dinner direction
director discover discuss discussion disease doctor document economic
economy education effect effort election employee energy enjoy enough
entire environment environmental especially establish evening event
eventually everybody everyone everything evidence exactly executive expect
expert explain factor failure feature federal feeling figure finally
financial finger finish follow foreign forget former forward function
future garden generation glass ground growth happen health hospital
however hundred husband identify image imagine impact improve indeed
indicate individual industry instead institution interesting international
interview investment involve island itself kitchen knowledge language
largely leader learn letter likely listen literature little location
machine magazine maintain majority manage management manager material
matter measure media medical meeting memory mention message method
middle military million minute mission model modern morning mouth
movement movie music myself natural nature nearly necessary network
newspaper nothing notice number object obviously occur official often
operation opinion opportunity option order organization original outside
painting parent particularly partner patient pattern peace performance
perhaps personal physical picture piece planet player please point
popular population positive potential power practice prepare pressure
pretty prevent price private probably production professional professor
property protect prove purpose quality quickly radio range rather reach
reality realize receive recent recently recognize record reduce reflect
region relate relationship religious remain remove represent 
resource respond response responsibility rest result reveal right rise
science scientist season section security seek senior sense series serious
serve service seven several shoulder significant similar simply
since sister situation skill small society soldier somebody someone
something sometimes source southern speech spring stage standard station
statement still stock strategy street structure student study stuff
style subject success successful suddenly suffer summer support surface
system table technology television themselves theory thing third
thousand threat throughout today tonight total tough toward trade
traditional training treatment trial trouble truth university until
usually value victim violence visit voice weapon weight western whatever
window within without woman wonder worker world writing yesterday
accept according account achieve across action actually administration
admit adult affect afternoon agency agent ahead allow almost alone along
already always amount animal answer anyone anything appear apply
approach area argue arrive artist assume attack attorney author away
baby base beat beautiful become begin behavior believe benefit best
better beyond billion black blood board body book born both break bring
brother build building business camera cancer candidate capital career
carry catch cause cell central century certainly chair challenge change
character charge check child choose church cultural decision definitely
delivery deliver description development difficulty discussion
efficient efficiency especially estimate everywhere excellent exception
existing expected explanation expression extremely familiar favorite
frequently generally happened helpful hopefully immediately implement
implementation improvement independent initial instance instructions
integration introduce introduction knowledge limited maintenance meanwhile
necessarily obviously occasionally otherwise particular perfectly
preferred presentation previous previously primary priority probably
procedure proposal question quickly recommend recommendation reference
regarding relevant reliable repository requirement requirements schedule
separate solution specific specifically straightforward summary
supposed temporary therefore thinking understanding unfortunately
update updated useful version whereas wonderful working
`.split(/\s+/)
  )
].filter((word) => word.length >= 6)
