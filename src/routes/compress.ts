import { Router, Request, Response } from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';
import { ALLOWED_SETTINGS, isCompressionProfile } from '../config/constants';
import { buildGhostscriptCommand } from '../utils/ghostscript';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('pdf'), (req: Request, res: Response): void => {
    const setting = req.query.profile as string;

    if (!isCompressionProfile(setting)) {
        res.status(400).json({
            error: `Invalid profile. Allowed: ${ALLOWED_SETTINGS.join(', ')}`
        });
        return;
    }

    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
        res.status(400).json({ error: 'PDF file is required.' });
        return;
    }

    const inputPath = file.path;
    const outputPath = `${inputPath}-compressed.pdf`;
    const gsCmd = buildGhostscriptCommand(setting, inputPath, outputPath);

    exec(gsCmd, (err) => {
        if (err) {
            console.error('Ghostscript Error:', err.message);
            res.status(500).send('Compression failed.');
            return;
        }

        res.download(outputPath, 'compressed.pdf', () => {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });
    });
});

export default router;
