
[how-to-use-bsp-trees-to-generate-game-maps](http://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268)

Here goes. ^^
Loopa igenom alla tiles, bitshifta in grannarna, upp, höger, ner, vänster 
(kanten av världen räknas som ingen granne, sen mappar du resultatet direkt till ett tile-index. Så binärt 0011, vad det nu blir i decimalt, kommer ge ett ner-vänster hörn. sen mappar du alla kombinationer, finns säkert färdiga tables eller ett snabbt kodat program som gör.

[11:29:00] Kalle Nilsson: Det är lite marching cubes-tänk på det. :)

[11:30:20] Kalle Nilsson: Sen kan man ta det ett steg längre med en offset beroende av vad det är för terräng osv.

[11:30:45] Kalle Nilsson: Bitshifta in grannarna är alltså binärt om det finns en granne eller inte.

Du struntar i luft-tilesen och kollar alla golv-tiles. 
Har du en granne (som är luft) uppåt shiftar du in en 1:a, 
har du ingen granne till höger shiftar du in en 0:a, och vidare ner och vänster. 
Sen ser du till att din tilemap har rätt tile på rätt plats. 
00000001 säger att det är en vägg-tile uppåt, alltså bör tile på index 1 vara ett rum med en vägg uppåt.
[11:45:44] Kalle Nilsson: 00000010 blir tile-index 2 och den tilen ska vara ett rum med vägg till höger.

Gör du så så behöver du loopa igenom hela tilemappen en gång så har du rätt tiles överallt sen.

[Bitwise_Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Right_shift)


men du definierar upp:
var UP = 1;
var RIGHT = 2;
var DOWN = 4;
var LEFT = 8;
sen är tileNumer = hasNeighbourUp ? UP : 0 | hasNeighbourRight ? RIGHT : 0 | hasNeighbourDown ? DOWN : 0 | hasNeighbourLeft ? LEFT : 0;
[13:34:02] Kalle Nilsson: Då får tileNumber ett index från 0 (tom golv-tile), 1 = vägg uppåt, osv till 15 = väggar runt hela tilen.
[13:34:48] Kalle Nilsson: Sen i din png-tilemap ligger en tom golv-tile på index 1, vägg uppåt vredvid den etc.


<strike>{
    north: 1,   // 0000 0001
    east: 2,    // 0000 0010
    south: 3,   // 0000 0011
    west: 4     // 0000 0100
}</strike>

<pre>
var north = 1;
var east = 2;
var south = 4;
var west = 8;



var northEast = north | east; // 3
var southEast = south | east; // 6
var northWest = north | west; // 9
var southWest = south | west; // 12

console.log("north:", north, north.toString(2)); // 1

console.log("east:", east, east.toString(2)); // 2

console.log("northEast:", northEast, northEast.toString(2)); // 3

console.log("south:", south, south.toString(2)); // 4

console.log("southEast:", southEast, southEast.toString(2)); // 6

console.log("west:", west, west.toString(2)); // 8

console.log("northWest:", northWest, northWest.toString(2)); // 9

console.log("southWest:", southWest, southWest.toString(2)); // 12

</pre>