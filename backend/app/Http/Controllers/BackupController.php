<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends Controller
{
    /**
     * Download a backup of the current database.
     */
    public function download(Request $request)
    {
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');

        $filename = "backup-" . $database . "-" . date('Y-m-d-H-i-s') . ".sql";

        // Using mysqldump command
        // We use proc_open to stream the output directly to the response
        $command = "mysqldump --user={$username} " . ($password ? "--password={$password} " : "") . "--host={$host} {$database}";

        return new StreamedResponse(function () use ($command) {
            $handle = popen("{$command} 2>&1", 'r');
            while (!feof($handle)) {
                echo fread($handle, 1024 * 8);
                flush();
            }
            pclose($handle);
        }, 200, [
            'Content-Type' => 'application/x-sql',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Get backup info
     */
    public function index()
    {
        return response()->json([
            'database' => config('database.connections.mysql.database'),
            'last_backup' => null, // You could implement a history if needed
        ]);
    }

    /**
     * Restore database from an uploaded SQL file
     */
    public function restore(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();

        if (strtolower($extension) !== 'sql') {
            return response()->json(['message' => 'Only .sql files are allowed'], 400);
        }

        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');

        $path = $file->getRealPath();

        // Warning: This will drop and recreate tables if the SQL file has those commands
        // mysql --user=... --password=... --host=... database < path/to/file.sql
        
        // Escape password if it exists
        $passArg = $password ? "-p\"" . addcslashes($password, '"$') . "\"" : "";
        
        // Build the command
        // Note: For Windows, we use the shell to redirect input
        $command = "mysql -h {$host} -u {$username} {$passArg} {$database} < \"{$path}\"";

        try {
            // We use shell_exec for input redirection
            $output = [];
            $resultCode = 0;
            exec($command . " 2>&1", $output, $resultCode);

            if ($resultCode !== 0) {
                return response()->json([
                    'message' => 'Restore failed',
                    'error' => implode("\n", $output)
                ], 500);
            }

            return response()->json(['message' => 'Database restored successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Restore failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
