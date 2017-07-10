angular.module('skytutorial')
    .controller('RevenueController', ['bbuiShellService', '$scope', '$q','bbMoment', '$location', function (bbuiShellService, $scope, $q,bbMoment, $location) {

        var self = this,
            svc = bbuiShellService.create(),
            CONSTITUENT_ID = $location.search().constituentId,
            CONSTITUENTREVENUE_DATALIST_ID = "93519AE3-EF3F-4f1d-A3CA-EB78BFB76087",
            revenueList = [];

        $scope.loading = true;

        function getRevenueListAsync() {

            $q.all([
                svc.dataListLoad(CONSTITUENTREVENUE_DATALIST_ID,
                CONSTITUENT_ID,
                {
                    parameters: [
                        {
                            name: "DATERANGECODE",
                            value: 0
                        }

                    ]
                }),
            ]).then(function (replies) {

                    var data 

                    data = {
                        revenueList: revenueList
                    };

                    angular.forEach(replies[0].data.rows, function (row) {
                        var revenue = row.values;

                        //Better to limit the results on server side, limiting here for demo.
                        if (revenueList.length >= 5) {
                            return data;
                        }

                        revenueList.push({
                            type: revenue[4],
                            date: bbMoment(revenue[6]).format("LL"),
                            amount: parseFloat(revenue[7]),
                            paymentMethod: revenue[11],
                            detail: revenue[12]
                        });
                    });

                    return data;

            }, function (response) {
                alert("Something went wrong!");
                console.error(JSON.stringify(response));
            }).finally(function () {
                $scope.loading = false;
            });

        }

        getRevenueListAsync();

        return {
            revenueList: revenueList
        };

    }]);
