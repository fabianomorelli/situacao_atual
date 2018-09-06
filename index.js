(function(){
  "use strict";

  /**
   * Create a chart
   * @param {JSON} data - Value to fill the chart
   * @param {String} type - Type of char (http://www.chartjs.org/docs/latest/charts/)
   * @param {Object} element - Html element
   * @param {String} labelKey - Object key that represents the label
   * @param {String} valueKey - Object key that represents the value
   */
  function createChart(data, type, element, labelKey, valueKey){
    var labels = data.map(function(dataElem){
      return dataElem[labelKey];
    });
    var values = data.map(function(dataElem){
      return dataElem[valueKey];
    });

    var options = {};

    if (type == "bar" || type =="horizontalBar"){
      options = {
        legend: {display: false},
        title: {
          display: true,
          text: 'Contagem de focos'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      };
    }
    var char = new Chart(element, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: "Focos",
          backgroundColor: 'rgb(247, 195, 121)',
          data: values
        }]
      },
      options: options
    });
  }

  /**
   * Create a table
   * @param {JSON} data - Value to fill the table
   * @param {String} element - Html element
   * @param {String} nameKey - Object key that represents the name
   * @param {String} valueKey - Object key that represents the value
   */
  function createTable(data, element, nameKey, valueKey){
    for (var i = 0; i < data.length; i++){
      var index = i + 1;
      var tableLine = "<tr><th scope=\"row\">" + index + "</th><td>"+data[i][nameKey]+"</td><td>"+data[i][valueKey]+"</td></tr>";
      element.append(tableLine);
    }
  }

  /**
   * Normalize data to create chart and table
   * @param {JSON} data - Data to be normalized
   * @param {Array} fieldsToNormalize - Arrays field to normalize
   * @return {JSON} [{name: String, quantidade: Number}]
   */
  function normalizeData(data, fieldsToNormalize){
    var dataNormalized = [];
    if (data && data.features && Array.isArray(data.features)){
      data.features.forEach(function(feature){
        var featureNormalized = {};
        fieldsToNormalize.forEach(function(field){
          if (feature.properties.hasOwnProperty(field)){
            featureNormalized[field] = feature.properties[field];
          }
        });
        if (feature.properties[fieldsToNormalize[1]] != null)
          dataNormalized.push(featureNormalized);
      });
      return dataNormalized;
    } else {
      return dataNormalized;
    }
  }

  /**
   *
   * @param {JSON} data - Data to create chart and table
   * @param {String} tableId - Html element id of table
   * @param {String} chartId - Html element id of chart
   * @param {String} chartType - Chart type
   * @param {Array} fieldsToFill - Arrays field to fill table and chart
   */
  function createDataObjects(data, tableId, chartId, chartType, fieldsToFill){
    var normalizedData = normalizeData(data, fieldsToFill);
    var tableBodyElement = $("#"+tableId+" tbody");
    createTable(normalizedData, tableBodyElement, fieldsToFill[0], fieldsToFill[1]);
    var chartElement = document.getElementById(chartId).getContext('2d');
    createChart(normalizedData, chartType, chartElement, fieldsToFill[0], fieldsToFill[1]);
  }

  /**
   * Function to create a range date from yesterday to today
   * @returns {String}
   */
  function getTimeInfoSinceYesterday(){
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() -1);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);
    return yesterday.toISOString() + "/" + today.toISOString();
  }

  $(document).ready(function() {

    var mapImage = document.getElementById("mainImage");
    var timeInfo = getTimeInfoSinceYesterday();
    var imageHref = "http://www.terrama2.dpi.inpe.br/terrama2q/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=bluemarble:marble_pyramid,terrama2_6:view6&time=" + timeInfo + "&styles=&bbox=-86,-56,-29,12&width=600&height=720&srs=EPSG:4326&format=image%2Fpng";
    //var imageHref = "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_9:marble_pyramid,terrama2q:focos&time=2017-12-05T00:59:11.000Z/2017-12-05T08:59:11.000Z&styles=&bbox=-86,-56,-29,12&width=600&height=720&srs=EPSG:4326&format=image%2Fpng";
    mapImage.setAttribute("src", imageHref);


    var mapImageTemp = document.getElementById("mainImageTemperatura");
    var imageHrefTemp = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_8:view8&styles=&bbox=-86,-56,-29,12&width=600&height=720&srs=EPSG:4326&format=image%2Fpng";
//    var imageHrefTemp = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_8:view8&time=" + timeInfo $
    console.log(imageHrefTemp);
    mapImageTemp.setAttribute("src", imageHrefTemp);



    //var ajaxUrl = "http://localhost:8080/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=terrama2_11:view11&propertyName=ocorrencia,monitored_nome&sortBy=ocorrencia+D&startIndex=0&count=30";
    //"http://www.terrama2.dpi.inpe.br/terrama2q/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=terrama2_11:view11&propertyName=nfocos24h,monitored_nome&sortBy=nfocos24h+D";
    //Paises
    var mapImagePaises1d = document.getElementById("mainImagePaises1d");
    var imageHrefPaises1d = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_14/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_14:view14&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefPaises1d);
    mapImagePaises1d.setAttribute("src", imageHrefPaises1d);

    var mapImagePaisesMes = document.getElementById("mainImagePaisesMes");
    var imageHrefPaisesMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_17/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_17:view17&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefPaisesMes);
    mapImagePaisesMes.setAttribute("src", imageHrefPaisesMes);

    var mapImagePaisesAno  = document.getElementById("mainImagePaisesAno");
    var imageHrefPaisesAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_13/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_13:view13&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefPaisesAno);
    mapImagePaisesAno.setAttribute("src", imageHrefPaisesAno);

    var mapImageEstados1d  = document.getElementById("mainImageEstados1d");
    var imageHrefEstados1d = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_18/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_18:view18&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefEstados1d);
    mapImageEstados1d.setAttribute("src", imageHrefEstados1d);

    var mapImageEstadosMes = document.getElementById("mainImageEstadosMes");
    var imageHrefEstadosMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_20/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefEstadosMes);
    mapImageEstadosMes.setAttribute("src", imageHrefEstadosMes);

    var mapImageEstadosAno = document.getElementById("mainImageEstadosAno");
    var imageHrefEstadosAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_21/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_21:view21&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefEstadosAno);
    mapImageEstadosAno.setAttribute("src", imageHrefEstadosAno);

    var mapImageBiomas1d = document.getElementById("mainImageBiomas1d");
    var imageHrefBiomas1d = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_22/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_22:view22&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefBiomas1d);
    mapImageBiomas1d.setAttribute("src", imageHrefBiomas1d);

    var mapImageBiomasMes = document.getElementById("mainImageBiomasMes");
    var imageHrefBiomasMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_24/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_24:view24&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefBiomasMes);
    mapImageBiomasMes.setAttribute("src", imageHrefBiomasMes);


    var mapImageBiomasAno = document.getElementById("mainImageBiomasAno");
    var imageHrefBiomasAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_25/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_25:view25&styles=&bbox=-109.45,-55.985,-28.8349999999999,13.3950000000001&width=768&height=660&srs=EPSG:4326&format=image%2Fpng";
    console.log(imageHrefBiomasAno);
    mapImageBiomasAno.setAttribute("src", imageHrefBiomasAno);


    var fieldsPaises1d = ["monitored_name_0", "nfocos24h"];
    //var urlPaises1d = "http://www.terrama2.dpi.inpe.br/terrama2q/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=terrama2_5:view_paises_24&propertyName=nfocos24h,monitored_name_0&sortBy=execution_date+D,nfocos24h+D&count=13";
    var urlPaises1d = "http://www.terrama2.dpi.inpe.br/terrama2q/geoserver/terrama2_5/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_5:view_paises_24&maxFeatures=13&outputFormat=application%2Fjson&propertyName=nfocos24h,monitored_name_0&sortBy=execution_date+D,nfocos24h+D&count=13";
    $.get(urlPaises1d, function(data, status){
      if (status == "success")
        createDataObjects(data, "tablePaises1d", "chartPaises1d", "bar", fieldsPaises1d);
    });

    var fieldsPaisesMes = ["monitored_name_0", "nfocosmes"];
    var final_url = '&propertyName=nfocosmes,monitored_name_0&sortBy=execution_date+D,nfocosmes+D&count=13'
    http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_17/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_17:view17&maxFeatures=13&outputFormat=application%2Fjson
    var urlPaisesMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_17/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_17:view17&maxFeatures=13&outputFormat=application%2Fjson&propertyName=nfocosmes,monitored_name_0&sortBy=execution_date+D,nfocosmes+D&count=13";
    $.get(urlPaisesMes, function(data, status){
      if (status == "success")
        createDataObjects(data, "tablePaisesMes", "chartPaisesMes", "horizontalBar", fieldsPaisesMes);
    });

    var fieldsPaisesAno = ["monitored_name_0", "nfocosano"];
    var urlPaisesAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_13/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_13:view13&maxFeatures=13&outputFormat=application%2Fjson&propertyName=nfocosano,monitored_name_0&sortBy=execution_date+D,nfocosano+D&count=13";
    $.get(urlPaisesAno, function(data, status){
      if (status == "success")
        createDataObjects(data, "tablePaisesAno", "chartPaisesAno", "horizontalBar", fieldsPaisesAno);
    });

    //Estados
    var fieldsEstados1d = ["monitored_name_1", "nfocos24h"];
    var urlEstados1d = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_18/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_18:view18&maxFeatures=10&outputFormat=application%2Fjson&propertyName=nfocos24h,monitored_name_1&sortBy=execution_date+D,nfocos24h+D&count=10";
    $.get(urlEstados1d, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableEstados1d", "chartEstados1d", "bar", fieldsEstados1d);
    });

    var fieldsEstadosMes = ["monitored_name_1", "nfocosmes"];
    var urlEstadosMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_20/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_20:view20&maxFeatures=10&outputFormat=application%2Fjson&propertyName=nfocosmes,monitored_name_1&sortBy=execution_date+D,nfocosmes+D&count=10";
    $.get(urlEstadosMes, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableEstadosMes", "chartEstadosMes", "horizontalBar", fieldsEstadosMes);
    });

    var fieldsEstadosAno = ["monitored_name_1", "nfocosano"];
    var urlEstadosAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_21/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_21:view21&maxFeatures=10&outputFormat=application%2Fjson&propertyName=nfocosano,monitored_name_1&sortBy=execution_date+D,nfocosano+D&count=10";
    $.get(urlEstadosAno, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableEstadosAno", "chartEstadosAno", "horizontalBar", fieldsEstadosAno);
    });

    //Biomas
    var fieldsBiomas1d = ["monitored_name", "nfocos24h"];
    var urlBiomas1d = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_22/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_22:view22&maxFeatures=6&outputFormat=application%2Fjson&propertyName=nfocos24h,monitored_name&sortBy=execution_date+D,nfocos24h+D&count=6";
    $.get(urlBiomas1d, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableBiomas1d", "chartBiomas1d", "bar", fieldsBiomas1d);
    });

    var fieldsBiomasMes = ["monitored_name", "nfocosmes"];
    var urlBiomasMes = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_24/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_24:view24&maxFeatures=6&outputFormat=application%2Fjson&propertyName=nfocosmes,monitored_name&sortBy=execution_date+D,nfocosmes+D&count=6";
    $.get(urlBiomasMes, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableBiomasMes", "chartBiomasMes", "horizontalBar", fieldsBiomasMes);
    });

    var fieldsBiomasAno = ["monitored_name", "nfocosano"];
    var urlBiomasAno = "http://www.terrama2.dpi.inpe.br/experimental/geoserver/terrama2_25/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=terrama2_25:view25&maxFeatures=6&outputFormat=application%2Fjson&propertyName=nfocosano,monitored_name&sortBy=execution_date+D,nfocosano+D&count=6";
    $.get(urlBiomasAno, function(data, status){
      if (status == "success")
        createDataObjects(data, "tableBiomasAno", "chartBiomasAno", "horizontalBar", fieldsBiomasAno);
    });
  });
}());
