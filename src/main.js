const url =
  "https://api.odcloud.kr/api/15055981/v1/uddi:6d218756-7258-42b6-9ab6-d3f07effeb0d?page=1&perPage=240&serviceKey=VfxwJOiRK4Lubg%2BzpSfUrSZpPCdgWPxRzvzRQyBH76dJsrXQ8xmYY1xae3ObsrVrmsWNO7twRmauyRcM0yqY%2Fg%3D%3D";
fetch(url)
  .then((res) => res.json())
  .then((myJson) => {
    var obj_key = Object.keys(myJson);
    var obj_value = myJson["data"];

    var count_h = 0,
      count_j = 0,
      count_c = 0,
      count_m = 0,
      count_f = 0,
      count_g = 0;

    var h_name = []; //한식 가게명
    var h_location = []; // 한식 주소
    var j_name = []; // 일식 가게명
    var j_location = []; // 일식 주소 ...
    var c_name = [];
    var c_location = [];
    var m_name = [];
    var m_location = [];
    var f_name = [];
    var f_location = [];
    var g_name = [];
    var g_location = [];

    for (var i = 0; i < obj_value.length; i++) {
      if (obj_value[i].메뉴 == "한식") {
        h_name[count_h] = obj_value[i].업소명;
        h_location[count_h] = obj_value[i].소재지;
        count_h++;
      } else if (obj_value[i].메뉴 == "일식") {
        j_name[count_j] = obj_value[i].업소명;
        j_location[count_j] = obj_value[i].소재지;
        count_j++;
      } else if (obj_value[i].메뉴 == "중국식") {
        c_name[count_c] = obj_value[i].업소명;
        c_location[count_c] = obj_value[i].소재지;
        count_c++;
      } else if (obj_value[i].메뉴 == "식육(숯불구이)") {
        m_name[count_m] = obj_value[i].업소명;
        m_location[count_m] = obj_value[i].소재지;
        count_m++;
      } else if (obj_value[i].메뉴 == "횟집") {
        f_name[count_f] = obj_value[i].업소명;
        f_location[count_f] = obj_value[i].소재지;
        count_f++;
      } else {
        g_name[count_g] = obj_value[i].업소명;
        g_location[count_g] = obj_value[i].소재지;
        count_g++;
      }
    }

    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    var map = new daum.maps.Map(mapContainer, mapOption);

    if (navigator.geolocation) {
      // 접속 위치를 얻어옴
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치 생성
          message = '<div style="padding:5px;">현위치!</div>'; // 표시할 내용

        // 마커와 정보 표시
        displayMarker(locPosition, message);
      });
    } else {
      // 접속 위치를 얻어올 수 없을 때

      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = "접속 위치를 찾을 수 없습니다";

      displayMarker(locPosition, message);
    }

    // 마커와 정보 표시
    function displayMarker(locPosition, message) {
      // 마커 생성
      var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성
      var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 인포윈도우를 마커위에 표시
      infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경
      map.setCenter(locPosition);
    }

    // 주소 -> 좌표 변환 객체를 생성
    var geocoder = new daum.maps.services.Geocoder();

    // 이미지 파일
    var K_imageSrc = "red.png"; // 한식
    var J_imageSrc = "orange.png"; // 일식
    var C_imageSrc = "yellow.png"; // 중식
    var M_imageSrc = "pink.png"; // 고기
    var F_imageSrc = "green.png"; // 회
    var G_imageSrc = "black.png"; // 기타

    // 한식
    for (var i = 0; i < h_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage1 = new kakao.maps.MarkerImage(K_imageSrc, imageSize);

      // 주소로 좌표를 검색
      geocoder.addressSearch(h_location[i], function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          // 결과값으로 받은 위치를 마커로 표시
          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage1,
          });
        }
      });
    }

    // 일식
    for (var i = 0; i < j_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage2 = new kakao.maps.MarkerImage(J_imageSrc, imageSize);

      geocoder.addressSearch(j_location[i], function (result, status) {
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage2,
          });
        }
      });
    }

    // 중식
    for (var i = 0; i < c_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage3 = new kakao.maps.MarkerImage(C_imageSrc, imageSize);

      geocoder.addressSearch(c_location[i], function (result, status) {
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage3,
          });
        }
      });
    }

    // 고기
    for (var i = 0; i < m_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage4 = new kakao.maps.MarkerImage(M_imageSrc, imageSize);

      geocoder.addressSearch(m_location[i], function (result, status) {
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage4,
          });
        }
      });
    }

    // 횟집
    for (var i = 0; i < f_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage5 = new kakao.maps.MarkerImage(F_imageSrc, imageSize);

      geocoder.addressSearch(f_location[i], function (result, status) {
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage5,
          });
        }
      });
    }

    //기타
    for (var i = 0; i < g_name.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage6 = new kakao.maps.MarkerImage(G_imageSrc, imageSize);

      geocoder.addressSearch(g_location[i], function (result, status) {
        if (status === daum.maps.services.Status.OK) {
          var coords = new daum.maps.LatLng(result[0].y, result[0].x);

          var marker = new daum.maps.Marker({
            map: map,
            position: coords,
            image: markerImage6,
          });
        }
      });
    }
  });
