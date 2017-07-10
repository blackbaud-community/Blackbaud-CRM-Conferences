

angular.module('skytutorial')
    .controller('ConstituentController', ['bbuiShellService', '$scope', '$q','$location', function (bbuiShellService, $scope, $q,$location) {

        var self = this,
            svc = bbuiShellService.create(),
            CONSTITUENT_ID = $location.search().constituentId,
            RELATIONSHIPTILE_ID = "4C7CB597-8DAF-40B0-8DCA-01D632364702",
            CONSTITUENTNAME_VIEW_ID = "3BC0BA15-6BF2-4c6d-A687-56B350A983FE",
            CONSTITUENTADDRESS_VIEW_ID = "c4ad6907-b917-4170-ab22-61c538085501",
            constituent = {};

        $scope.loading = true;

        function getConstituentAsync() {

            $q.all([
                svc.dataFormLoad(CONSTITUENTNAME_VIEW_ID, {
                    recordId: CONSTITUENT_ID
                }),
                svc.dataFormLoad(RELATIONSHIPTILE_ID, {
                    recordId: CONSTITUENT_ID
                }),
                    svc.dataFormLoad(CONSTITUENTADDRESS_VIEW_ID, {
                    recordId: CONSTITUENT_ID
                }),
            ]).then(function (replies) {

                constituent.name = replies[0].data.values[0].value;
                constituent.company = replies[1].data.values[5].value; // PRIMARYBUSINESSNAME
                constituent.primaryaddress = replies[2].data.values[2].value; //Primary address block
                constituent.email = replies[2].data.values[12].value; //email
                constituent.phone = replies[2].data.values[9].value;
                constituent.city = replies[2].data.values[3].value;
                constituent.postcode = replies[2].data.values[5].value;
                constituent.title = "CEO";
                constituent.alert = constituent.name + " " + "is an important member of our organization.";
            }, function (response) {
                alert("Something went wrong!");
                console.error(JSON.stringify(response));
            }).finally(function () {
                $scope.loading = false;
            });

        }

        getConstituentAsync();

        return {
            constituent: constituent
        };

    }]);
