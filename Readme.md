# Node.js tile server

This is a basic implementation of a node.js based vector tile server with data being served out of a postgis db

# DB

    ogrinfo -al -so PG:"dbname=teralytics user=vicpostgres password=vicpostgres host=localhost" -sql "SELECT * from ch_2po_4pgr"


# TODO

* unit tests
 * db module
 * api routes
* performance
 * data caching via an external cache for improved scalability (redis?)
 * hardcode geometry extent to skip querying db for tiles outside scope
* feature
 * raster tile service (via mapnik?)
 * login system
