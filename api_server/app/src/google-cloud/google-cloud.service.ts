import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as mime from 'mime-types';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class GoogleCloudService {
  public async uploadToStorage(fileExternalUrl: string, fileName: string) {
    // 書籍画像のアップロード
    const extention = path.parse(fileExternalUrl).ext;
    const ext = extention.split('?')[0];
    const tmpFilePath = path.join(__dirname, `./image${ext}`);
    const filePath = `${fileName}${ext}`;

    // 画像をダウンロード
    await this.downloadImage(fileExternalUrl, tmpFilePath);
    // 画像をアップロード
    await this.getStorageBucket().upload(tmpFilePath, {
      contentType: mime.lookup(filePath) || 'application/octet-stream',
      destination: filePath,
    });
    // ローカルに一時的に格納していたファイルを削除
    fs.unlinkSync(tmpFilePath);

    return filePath;
  }

  public async downloadFromStorage(filePath: string) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      const [fileData] = await this.getStorageBucket()
        .file(filePath)
        .download();
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';
      return `data:${mimeType};base64,${fileData.toString('base64')}`;
    }

    // 署名付きダウンロードURLを格納する
    const [signedUrl] = await this.getStorageBucket()
      .file(filePath)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + 30 * 60 * 1000,
      });
    return signedUrl;
  }

  private getStorageBucket() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      return new Storage({ apiEndpoint: process.env.GCS_ENDPOINT }).bucket(
        process.env.BUCKET_NAME ?? '',
      );
    } else {
      return new Storage({ keyFilename: process.env.GCS_KEY_FILE_PATH }).bucket(
        process.env.BUCKET_NAME ?? '',
      );
    }
  }

  private async downloadImage(url: string, filePath: string) {
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}
