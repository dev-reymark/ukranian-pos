<?php

namespace App\Http\Controllers;

use App\Models\CashDrawPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $cashDrawPeriod;

    public function __construct(CashDrawPeriod $cashDrawPeriod)
    {
        $this->cashDrawPeriod = $cashDrawPeriod;
    }

    public function getAllCashDrawByPosID(Request $request): JsonResponse
    {
        $posID = 1;

        $returnData = $this->cashDrawPeriod->getAllCashDrawByPosID($posID);
        return $this->handleResponse($returnData);
    }

    public function getCDrawHistByCDPeriod(Request $request): JsonResponse
    {
        $cdrawPeriodID = $request->input("cdrawPeriodID");

        $histrReturn = $this->cashDrawPeriod->getCDrawHistByCDPeriod($cdrawPeriodID);
        return $this->handleResponse($histrReturn);
    }

    private function handleResponse(array $data): JsonResponse
    {
        if ($data["result"]) {
            return response()->json([
                "statusCode" => 1,
                "statusDescription" => "Success",
                "data" => $data['data']
            ]);
        }

        return response()->json([
            "statusCode" => 0,
            "statusDescription" => $data['message']
        ]);
    }
}
