<!-- <?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TariffController extends Controller
{
    public function downloadFullTariff()
{
    $fullTariff = [
        ['Service' => 'X-Ray', 'Category' => 'Radiology', 'Tariff' => 5000],
        ['Service' => 'MRI Scan', 'Category' => 'Radiology', 'Tariff' => 25000],
        ['Service' => 'Consultation', 'Category' => 'Outpatient', 'Tariff' => 2000],
        ['Service' => 'Blood Test', 'Category' => 'Laboratory', 'Tariff' => 1500],
        // Add all services here
    ];

    $collection = new Collection($fullTariff);

    return Excel::download($collection, '/app/LEADWAY HEALTH TARIFF.xlsx');
}
} -->
