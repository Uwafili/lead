<?php

namespace App\Services;

class JsonSafetyService
{
    public static function isValidJson(string $json): bool
    {
        json_decode($json);

        return json_last_error() === JSON_ERROR_NONE;
    }

    public static function repairJson(string $json): string
    {
        // Remove control chars
        $json = preg_replace('/[\x00-\x1F\x7F]/u', '', $json);

        // Remove trailing commas
        $json = preg_replace('/,\s*([}\]])/', '$1', $json);

        return $json;
    }

    public static function decode(string $json, bool $assoc = true)
    {
        $data = json_decode($json, $assoc);

        if (json_last_error() === JSON_ERROR_NONE) {
            return $data;
        }

        // Try repair
        $fixed = self::repairJson($json);

        $data = json_decode($fixed, $assoc);

        if (json_last_error() === JSON_ERROR_NONE) {
            return $data;
        }

        logger()->error("JSON decode failed", [
            'error' => json_last_error_msg(),
            'sample' => substr($json, 0, 300)
        ]);

        return [];
    }

public static function validateArray(array $data): array
{
    $clean = [];
    $bad = [];

    foreach ($data as $category => $items) {

        // ensure it's an array
        if (!is_array($items)) {
            $bad[$category] = $items;
            continue;
        }

        foreach ($items as $row) {

            if (!is_array($row)) {
                $bad[$category][] = $row;
                continue;
            }

            if (!isset($row['CODE'])) {
                $bad[$category][] = $row;
                continue;
            }

            $description =
                $row['DESCRIPTION']
                ?? $row['DESCRIPTION OF SERVICE']
                ?? null;

            if (!$description || !is_string($description)) {
                $bad[$category][] = $row;
                continue;
            }

            $description = preg_replace(
                '/[\x00-\x1F\x7F]/u',
                '',
                trim($description)
            );

            $tariff = $row['TARIFF'] ?? null;

            if ($tariff !== null) {
                $tariff = str_replace([',', ' '], '', $tariff);
                $tariff = is_numeric($tariff) ? (float) $tariff : null;
            }

            $clean[$category][] = [
                'CODE' => trim($row['CODE']),
                'DESCRIPTION' => $description,
                'TARIFF' => $tariff
            ];
        }
    }

    return [
        'clean' => $clean,
        'bad' => $bad
    ];
}


}