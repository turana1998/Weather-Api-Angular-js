import {angular} from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-material';


angular.module('weatherapp',['ngMaterial','ngMessages'])

.run(($rootScope)=>{
    let history=JSON.parse(localStorage.getItem('history'));
    if(history){
        history.forEach(element => {
            console.log(element.id);
        });
    }
    $rootScope.history=history ? history : [];
    $rootScope.apiKey="ab328b3e3b40bc860da55c0ea5d4d567";
    $rootScope.selectedHistory=null;
    $rootScope.menuOpen=false;
})
.controller('SearchController',($scope,$http,$rootScope,$timeout, $q,  $mdSidenav)=>{
    $scope.citiesAll=[
        {id:1,city:'Baku',country:'Azerbaijan'},
        {id:2,city:'London',country:'England'},
        {id:3,city:'Ankara',country:'Turkey'},
        {id:4,city:'Paris',country:'Fransa'},
        {id:5,city:'Madrid',country:'İspaniya'},
        {id:6,city:'Tirana',country:'Albaniya'},
        {id:7,city:'Angola',country:'Luanda'},
        {id:8,city:'Austria',country:'Viyena'},
        {id:9,city:'Dakka',country:'Banqladesh'},
        {id:10,city:'Ottava',country:'Kanada'},
        {id:11,city:'Atena',country:'Yunanistan'},
        {id:12,city:'Oslo',country:'Norvec'},
        {id:13,city:'Roma',country:'İtalya'},
        {id:14,city:'Kiyev',country:'Ukraniyas'},

    ];

    $scope.toggleSidenav=()=>{
        $rootScope.menuOpen=!$rootScope.menuOpen;
        $mdSidenav("right").toggle();
    }

    $scope.getMatches=(searchText)=>{
        console.log(searchText);
        var results = searchText ? $scope.citiesAll.filter(item=>item.city.toUpperCase().indexOf(searchText.toUpperCase())>-1) : [];
        var deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
    }

    $scope.$watch('keyword',()=>{
        console.log($scope.searchText);
        if($scope.keyword)
            $scope.cities=$scope.citiesAll.filter(item=>item.city.toUpperCase().indexOf($scope.keyword.toUpperCase())>-1);
        else $scope.cities=[];
    })

    $scope.selectedItemChange=(city)=>{
        $http({
            url:"http://api.openweathermap.org/data/2.5/weather?q="+city.city+"&appid="+$scope.apiKey,
            method:"GET"
        }).then(response=>{

           $rootScope.selectedHistory={
                wheather:response.data.main,
                city:city,
                date:new Date()
            };
            $rootScope.selectedHistory.wheather.celcius=parseInt(response.data.main.temp-272.15);
            $rootScope.history.push($rootScope.selectedHistory);
            //$scope.weatherTxt=response.data.main.temp-272.15+"°C";
            //$rootScope.selectedItem
        },err=>{console.log(err)})
    }

   /*  $scope.handleInput=(keyword)=>{
        if(keyword)
            $scope.cities=$scope.citiesAll.filter(item=>item.city.toUpperCase().indexOf($scope.searchText.toUpperCase())>-1);
        else $scope.cities=[];
    } */

    $scope.searchText=null;

   
    $scope.getWeather=(city)=>{
        $http({
            url:"http://api.openweathermap.org/data/2.5/weather?q="+city.city+"&appid="+$scope.apiKey,
            method:"GET"
        }).then(response=>{
            $rootScope.selectedHistory={
                wheather:response.data.main,
                city:city,
                date:new Date()
            };
           $scope.add($rootScope.selectedHistory);
        },err=>{console.log(err)})
    }

    $scope.add=(hisOb)=>{
        hisOb.id=$rootScope.history.length; 
        $rootScope.history.push(hisOb);
        localStorage.setItem('history',JSON.stringify($rootScope.history));
    }
})
.controller('HistoryController',($scope,$rootScope)=>{

    $scope.showSelHistory=function(item){
        $rootScope.selectedHistory=item;
    }
   
})
