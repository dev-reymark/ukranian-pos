<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;

class LookUpController extends Controller
{
    public function getReceiptLayout()
    {
        $posID = 1;

        // Call the model method to get the receipt layout
        $receiptLayout = (new Receipt)->getReceiptLayout($posID);

        if (!$receiptLayout) {
            return response()->json([
                "statusCode" => 0,
                "statusDescription" => "Failed to retrieve receipt layout"
            ]);
        }

        return response()->json([
            "statusCode" => 1,
            "statusDescription" => "Success",
            "data" => $receiptLayout
        ]);
    }
}
