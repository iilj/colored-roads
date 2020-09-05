道路を方角ごとに着色するやつ
=====

[道路を方角ごとに着色するやつ](https://iilj.github.io/colored-roads/)

## 概要

道路を方角ごとに着色した地図を表示します．

地図データは OpenStreetMap のベクタタイル情報を Nextzen API 経由で読み込んでいます．

- [OpenStreetMap](https://www.openstreetmap.org/)
- [Nextzen](https://www.nextzen.org/)

## 着色の仕様

道路の色は polyline を構成する線分ごとに方位を計算して決定しています．

直行する道路は同じ色で塗られます．道路の方向が 90 度変わるごとに色相環を1周するような調子で色を変えています．

## リンク

- [道路を方角ごとに塗り分けると、その街のでき方がわかる :: デイリーポータルZ](https://dailyportalz.jp/kiji/douro-hougaku-machi-no-dekikata)
  - この記事を見かけて，道路を塗り分けるやつを実際に作ろうと思った．
- [国土地理院のバイナリベクトルタイルを OpenLayers で表示 \- 水戸地図](https://cieloazul310.github.io/2019/08/openlayers-vt/)
  - ベクタタイルの簡単な使用方法は，この記事で初めて触れた．
  - 今回は日本国内に限定したくなかったため，国土地理院のデータではなく OSM のタイルを用いた．
