import request from 'supertest';
import app from '../src/app';
import path from 'path';

describe('POST /compress', () => {
    const samplePdf = path.join(__dirname, 'fixtures/sample.pdf');

    it('should return a compressed PDF with valid profile', async () => {
        const res = await request(app)
            .post('/compress?profile=ebook')
            .attach('pdf', samplePdf);

        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toBe('application/pdf');
    });

    it('should return 400 for invalid profile', async () => {
        const res = await request(app)
            .post('/compress?profile=invalid')
            .attach('pdf', samplePdf);

        expect(res.statusCode).toBe(400);
    });

    it('should return 400 if no file uploaded', async () => {
        const res = await request(app)
            .post('/compress?profile=screen');

        expect(res.statusCode).toBe(400);
    });
});
