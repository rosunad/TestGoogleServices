(function ($) {
    $.placesGraph = {
        defaults: {
            container: 'divContainer',
            latitude: 0,
            longitude: 0,
            radius: 500,
            map: null
        },
        dones:{
            doneCentrosEducativos: false,
            doneServiciosSanitarios: false,
            doneOcio: false,
            doneTransporte: false,
            doneZonasVerdes: false,
            doneComercio: false,
            doneServicios: false,
            doneSupermarket: false
        },
        categoriesTypes: {
            typesTransporte: ["airport", "bus_station", "subway_station", "taxi_stand", "train_station"],
            typesZonasVerdes: ["amusement_park", "campground", "park"],
            typesOcio: ["aquarium", "art_gallery", "bar", "bowling_alley", "cafe", "casino", "library", "museum", "night_club", "restaurant", "rv_park", "spa", "stadium", "movie_theater", "zoo"],
            typesSupermarket: ["grocery_or_supermarket"],
            typesComercio: ["bakery", "car_dealer", "car_rental", "clothing_store", "department_store", "establishment", "florist", "food", "furniture_store", "grocery_or_supermarket", "hardware_store", "home_goods_store", "jewelry_store", "liquor_store", "meal_delivery", "meal_takeaway", "electronics_store", "pet_store", "shoe_store", "shopping_mall"],
            typesServicios: ["bank", "beauty_salon", "bicycle_store", "book_store", "car_repair", "car_wash", "cemetery", "city_hall", "courthouse", "embassy", "finance", "fire_station", "funeral_home", "gym", "hair_care", "insurance_agency", "laundry", "lawyer", "local_government_office", "locksmith", "lodging", "electrician", "moving_company", "painter", "parking", "plumber", "police", "post_office", "real_estate_agency", "roofing_contractor", "storage", "store", "travel_agency"],
            typesServiciosSanitarios: ["doctor", "hospital", "pharmacy"],
            typesCentrosEducativos: ["school", "university"]
        },
        counters: {
            counterTransporte: 0,
            counterZonasVerdes: 0,
            counterOcio: 0,
            counterSupermarket: 0,
            counterComercio: 0,
            counterServicios: 0,
            counterServiciosSanitarios: 0,
            counterCentrosEducativos: 0
        },
        list:[],
        services: null
    };

    $.extend(true,$.placesGraph,{
        methods:{
            init: function (options) {
                debugger;
                $.extend($.placesGraph.defaults, options);

                if ($.placesGraph.defaults.map == null) {
                    $("body").append("<div id='mapContainer'></div>");
                    $.placesGraph.defaults.map = new google.maps.Map(document.getElementById("mapContainer"), { center: new google.maps.LatLng($.placesGraph.defaults.latitude, $.placesGraph.defaults.longitude), zoom: 15 });
                }

                $.placesGraph.services = new google.maps.places.PlacesService($.placesGraph.defaults.map);

                this.initGraph();

                return this;
            },
            initGraph: function () {
                list = [];
                this.cleanCounters();

                this.makeSearch($.placesGraph.categoriesTypes.typesTransporte, 'T', $.placesGraph.dones.doneTransporte, $.placesGraph.counters.counterTransporte);
                this.makeSearch($.placesGraph.categoriesTypes.typesZonasVerdes, 'ZV', $.placesGraph.dones.doneZonasVerdes, $.placesGraph.counters.counterZonasVerdes);
                this.makeSearch($.placesGraph.categoriesTypes.typesOcio, 'O', $.placesGraph.dones.doneOcio, $.placesGraph.counters.counterOcio);
                this.makeSearch($.placesGraph.categoriesTypes.typesSupermarket, 'SM', $.placesGraph.dones.doneSupermarket, $.placesGraph.counters.counterSupermarket);
                this.makeSearch($.placesGraph.categoriesTypes.typesComercio, 'C', $.placesGraph.dones.doneComercio, $.placesGraph.counters.counterComercio);
                this.makeSearch($.placesGraph.categoriesTypes.typesServicios, 'S', $.placesGraph.dones.doneServicios, $.placesGraph.counters.counterServicios);
                this.makeSearch($.placesGraph.categoriesTypes.typesServiciosSanitarios, 'SS', $.placesGraph.dones.doneServiciosSanitarios, $.placesGraph.counters.counterServiciosSanitarios);
                this.makeSearch($.placesGraph.categoriesTypes.typesCentrosEducativos, 'CE', $.placesGraph.dones.doneCentrosEducativos, $.placesGraph.counters.counterCentrosEducativos);

            },
            makeSearch: function (types, type, searched,counter) {
                var _self = this;
                services.nearbySearch({
                    location: { lat: $.placesGraph.defaults.latitude, lng: $.placesGraph.defaults.longitude },
                    types: types,
                    radius: $.placesGraph.defaults.radius
                }, function (result, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < result.length; i++) {
                            if (!_self.isDuplicate(list, result[i].name)) {
                                list.push({
                                    type: type,
                                    name: result[i].name,
                                    latitude: result[i].geometry.location.lat(),
                                    longitude: result[i].geometry.location.lng(),
                                    distance: getDistanceFromLatLonInKm($.placesGraph.defaults.latitude, $.placesGraph.defaults.longitude, result[i].geometry.location.lat(), result[i].geometry.location.lng()),
                                    address: result[i].vicinity
                                });

                                counter++;
                            }

                        }
                    }

                    searched = true;
                    if (_self.checkAllSearched()) {

                    }
                
                });

            },
            createGraph: function(){

                $.placesGraph.counters.counterZonasVerdes = $.placesGraph.counters.counterZonasVerdes * 2;
                if ($.placesGraph.counters.counterZonasVerdes > 19)
                    $.placesGraph.counters.zonasVerdes = 19;

                $('#' + defaults.container).html("").highcharts({
                    chart: {
                        polar: true,
                        type: 'area',
                        backgroundColor: '#f9f9f9'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '',
                        x: -80
                    },
                    pane: {
                        size: '80%'
                    },
                    colors: ["#BCD100"],
                    xAxis: {
                        categories: ['Centros Educativos', 'Servicios Sanitarios', 'Ocio', 'Transporte', 'Zonas Verdes', 'Comercio', 'Servicios', 'Supermercados'],
                        tickmarkPlacement: 'on',
                        lineWidth: 0
                    },

                    yAxis: {
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: 0,
                        max: 20,
                        tickInterval: 7,
                        visible: false,
                        labels: {
                            enabled: false
                        }
                    },
                    tooltip: {
                        enabled: false,
                        shared: true,
                        pointFormat: '<span>{point.y:,.0f}<br/>'
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Entorno',
                        data: [$.placesGraph.counters.counterCentrosEducativos, $.placesGraph.counters.counterServiciosSanitarios, $.placesGraph.counters.counterOcio, $.placesGraph.counters.counterTransporte, $.placesGraph.counters.counterZonasVerdes, $.placesGraph.counters.counterComercio, $.placesGraph.counters.counterServicios, $.placesGraph.counters.counterSupermarket],
                        pointStart: 0,
                        pointPlacement: 'on',
                        fillColor: "rgba(188, 209, 0, 0.5)",
                        marker: {
                            radius: 6
                        }
                    }]

                });
            },
            isDuplicate: function (list, name) {
                for (var i = 0; i < list().length; i++) {
                    if (list()[i].name.toUpperCase() == name.toUpperCase())
                        return true;
                }

                return false;
            },
            getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
                var dLon = this.deg2rad(lon2 - lon1);
                var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            },
            deg2rad: function (deg) {
                return deg * (Math.PI / 180);
            },
            checkAllSearched: function () {
                for (var i = 0; i < Object.keys($.placesGraph.dones).length; i++) {
                    if (!$.placesGraph.dones[i]) {
                        return false;
                    }
                }

                return true;
            },
            cleanCounters: function () {
                for (var i = 0; i < Object.keys($.placesGraph.counters).length; i++) {
                    $.placesGraph.counters[i] = 0;
                }
            }
        }
    });


    $.fn.placesGraph = function (method) {
        // Si existe la funcion la llamamos
        if ($.placesGraph.methods[method]) {
            return $.placesGraph.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            // Si no se pasa ningún parámetro o el parámetro es un objeto de configuración llamamos al inicializador
            return $.placesGraph.methods.init.apply(this, arguments);
        } else {
            // En el resto de los casos mostramos un error
            $.error('La función ' + method + ' no existe');
        }
    };
})(jQuery);
