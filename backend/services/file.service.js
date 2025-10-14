import { Client, Storage, ID } from 'node-appwrite'
import fs from 'fs'
import os from 'os'
import path from 'path'
import FormData from 'form-data'
import axios from 'axios'

class FileService {
  constructor() {
    if (!process.env.APPWRITE_ENDPOINT) {
      throw new Error('APPWRITE_ENDPOINT environment variable is required')
    }
    if (!process.env.APPWRITE_PROJECT_ID) {
      throw new Error('APPWRITE_PROJECT_ID environment variable is required')
    }
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('APPWRITE_API_KEY environment variable is required')
    }
    if (!process.env.APPWRITE_BUCKET_ID) {
      throw new Error('APPWRITE_BUCKET_ID environment variable is required')
    }

    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)

    this.storage = new Storage(this.client)
    this.bucketId = process.env.APPWRITE_BUCKET_ID

  }

  async uploadFile(file, folder = 'general') {
    try {
      if (!file || !file.buffer) {
        throw new Error("Fayl tanlanmadi yoki noto'g'ri formatda")
      }

      const uploadsDir = path.join(os.tmpdir(), 'uploads')
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true })
      }

      const uniqueId = ID.unique()
      const filename = `${Date.now()}_${file.originalname}`
      const filePath = path.join(uploadsDir, filename)

      // Vaqtinchalik saqlash
      await fs.promises.writeFile(filePath, file.buffer)

      const form = new FormData()
      form.append('fileId', uniqueId)
      form.append('file', fs.createReadStream(filePath))

      const { data } = await axios.post(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY
          }
        }
      )

      await fs.promises.unlink(filePath)

      return {
        success: true,
        fileId: data.$id,
        fileName: filename,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileUrl: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${data.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async deleteFile(fileId) {
    try {
      const { data } = await axios.delete(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}`,
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY
          }
        }
      )
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getFileInfo(fileId) {
    try {
      const { data } = await axios.get(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}`,
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY
          }
        }
      )

      return {
        success: true,
        file: {
          id: data.$id,
          name: data.name,
          size: data.sizeOriginal || data.size,
          mimeType: data.mimeType || 'application/octet-stream',
          originalName: data.name,
          url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${data.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }


  async createFileToken(fileId) {
    try {
      const response = await axios.post(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/tokens`,
        {
          expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          write: false,
          delete: false
        },
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      )
      return {
        success: true,
        token: response.data.$id
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Faylni yuklab olish (token bilan)
  async downloadFile(fileId) {
    try {
      
      
      // Avval file token yaratish
      const tokenResult = await this.createFileToken(fileId)
      
      if (!tokenResult.success) {
        
        // Token yaratishda xatolik bo'lsa, oddiy usulni sinab ko'rish
        const response = await axios.get(
          `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/download`,
          {
            headers: {
              'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
              'X-Appwrite-Key': process.env.APPWRITE_API_KEY
            },
            responseType: 'arraybuffer'
          }
        )
        
        return { success: true, data: response.data, headers: response.headers }
      }

      
      // Token bilan faylni yuklab olish
      const response = await axios.get(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/download?token=${tokenResult.token}`,
        {
          responseType: 'arraybuffer'
        }
      )


      return { success: true, data: response.data, headers: response.headers }
    } catch (error) {
      
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      return { success: false, error: error.message }
    }
  }
}

export default new FileService()