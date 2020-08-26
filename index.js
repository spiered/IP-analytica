// Where Are My Friends
// Autor: Spiered 2020

/*
packages used:
- express
- geolib
- geoip-lite
- request-ip
- ejs
*/

const express = require("express");
const requestIp = require("request-ip");
const geolib = require("geolib");
const geoip_lite = require("geoip-lite");
const app = express();
const ejs = require("ejs");
const PORT = 3000;

app.use(express.static("views"));
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs")

let ip_addresses = [
  "86.192.235.252",
  "64.233.191.255"
];

let ip_addresses_selected = [
  "86.192.235.252",
  "64.233.191.255"
];

app.get("/", (req, res) => {
  ip_addresses = [
    "86.192.235.252",
    "64.233.191.255"
  ];
  client_ip_address = requestIp.getClientIp(req);
  ip_addresses.push(client_ip_address);
  let distances = sort_ip_addresses(ip_addresses, ip_addresses[ip_addresses.length]);
  distances_with_unit = choose_unit(distances);
  console.log(distances_with_unit);
  //let middle = find_middle(ip_addresses_selected, client_ip_address);
  res.render("index", { distances_with_unit: distances_with_unit, client_ip_address:client_ip_address });
});

function sort_ip_addresses(ip_list, ip) {
  const client_geo = geoip_lite.lookup(client_ip_address);
  console.log(client_geo)
  const client_lattitude = client_geo.ll[0];
  const client_longitude = client_geo.ll[1];
  let distance_list = [];
  let list_geo, list_lattitude, list_longitude, distance;
  ip_list.forEach((ip_address) => {
    list_geo = geoip_lite.lookup(ip_address);
    list_lattitude = list_geo.ll[0];
    list_longitude = list_geo.ll[1];
    distance = geolib.getPreciseDistance(
      { latitude: list_lattitude, longitude: list_longitude },
      { latitude: client_lattitude, longitude: client_longitude },
      0.1
    );
    distance_list.push(distance);
  });
  distance_list.pop();
  distance_list.sort((a, b) => {
    return a - b;
  });
  return distance_list;
}

function choose_unit(distances) {
  let distances_with_unit = [];
  distances.forEach((distance) => {
    if (distance >= 1000) {
      distance /= 1000;
      distance = `${distance} km`;
    } else {
      distance = `${distance} m`;
    };
    distances_with_unit.push(distance);
  });
  return distances_with_unit;
};
/*
function find_middle(list, original_ip){
  sort_ip_addresses(list, original_ip);
  list.push(orignal_ip);
  let object_list = {};
  list.map((ll)=>)
  geolib.getCenter([
    { latitude: 52.516272, longitude: 13.377722 },
    { latitude: 51.515, longitude: 7.453619 },
    { latitude: 51.503333, longitude: -0.119722 },
  ]);
}
*/
app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
