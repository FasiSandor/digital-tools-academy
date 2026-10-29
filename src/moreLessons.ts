import type {ExtraLesson} from './extraLessons';
export const moreLessons:Record<string,ExtraLesson[]>={
 GeoGebra:[
 {id:'gg10',title:'Függvénytranszformációk',summary:'Eltolás, nyújtás és tükrözés csúszkákkal.',steps:['Nyisd meg a GeoGebra grafikus számológépet.','Írd be: a=1, b=0, c=0.','Hozz létre csúszkákat a paraméterekhez.','Ábrázold: f(x)=a*(x-b)^2+c.','Állítsd b=2, c=3 értékre, majd keresd meg a csúcspontot.'],task:'Mennyi a csúcspont y-koordinátája, ha f(x)=(x−2)²+3?',answer:'3',url:'https://www.geogebra.org/graphing'},
 {id:'gg11',title:'Kör egyenlete',summary:'Középpont és sugár vizuális értelmezése.',steps:['Nyisd meg a GeoGebra grafikus számológépet.','Írd be: (x-1)^2+(y+2)^2=9.','Keresd meg a kör középpontját.','A sugár négyzete 9, ezért a sugár 3.'],task:'Mennyi a kör sugara?',answer:'3',url:'https://www.geogebra.org/graphing'}],
 Desmos:[
 {id:'ds8',title:'Lineáris regresszió',summary:'Adatpontokhoz illeszkedő egyenes.',steps:['Nyisd meg a Desmos számológépet, és hozz létre táblázatot.','Vedd fel a pontokat: (1,2), (2,4), (3,6).','Írd be: y_1~m x_1+b a táblázat oszlopneveivel.','Olvasd le a becsült m meredekséget.'],task:'Mennyi a pontokhoz illeszkedő egyenes meredeksége?',answer:'2',url:'https://www.desmos.com/calculator'},
 {id:'ds9',title:'Függvények metszéspontja',summary:'Két egyenes közös pontja.',steps:['Ábrázold: y=x+2.','Ábrázold: y=-x+4.','Kattints a metszéspont jelölésére.','Ellenőrizd behelyettesítéssel.'],task:'Mennyi a metszéspont x-koordinátája?',answer:'1',url:'https://www.desmos.com/calculator'}],
 'Wolfram|Alpha':[
 {id:'wa8',title:'Szélsőérték keresése',summary:'Másodfokú függvény minimumának vizsgálata.',steps:['Írd be: minimize x^2-4x+7.','Olvasd le a minimumértéket.','Ellenőrizd teljes négyzetté alakítással: (x-2)^2+3.'],task:'Mennyi a minimumérték?',answer:'3',url:'https://www.wolframalpha.com/'},
 {id:'wa9',title:'Határozott integrál',summary:'Görbe alatti előjeles terület számítása.',steps:['Írd be: integrate x^2 from 0 to 3.','Olvasd le a határozott integrál értékét.','Ellenőrizd az x³/3 primitív függvénnyel.'],task:'Mennyi az integrál értéke?',answer:'9',url:'https://www.wolframalpha.com/'}]
};