<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $this->copyMenuAssets();

        $this->call([
            PokeSeeder::class,
            BobaSeeder::class,
            SnackSeeder::class,
        ]);
    }

    private function copyMenuAssets(): void
    {
        foreach (['snacks', 'boba'] as $subdir) {
            $source = public_path("images/{$subdir}");
            $target = storage_path("app/public/menu/{$subdir}");

            if (!File::exists($source)) {
                continue;
            }

            File::ensureDirectoryExists($target);

            foreach (File::files($source) as $file) {
                $dest = $target.DIRECTORY_SEPARATOR.$file->getFilename();
                if (!File::exists($dest)) {
                    File::copy($file->getPathname(), $dest);
                }
            }
        }
    }
}
