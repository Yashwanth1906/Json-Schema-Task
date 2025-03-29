import { addEntry, updateEntry, deleteEntry } from '../controllers/normalContent.js';
import { docs } from '../docsSetup.js';

jest.mock('../docsSetup.js', () => ({
  docs: {
    documents: {
      get: jest.fn(),
      batchUpdate: jest.fn()
    }
  }
}));

describe('Normal Content Operations', () => {
  beforeEach(() => { 
    jest.clearAllMocks();
  });

  describe('addEntry', () => {
    it('should add content at the end of the document', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Existing content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          content: 'New content',
          position: 'end'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await addEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Entry added successfully.'
      });
    });

    it('should add content at the beginning of the document', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Existing content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          content: 'New content',
          position: 'start'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await addEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Entry added successfully.'
      });
    });
  });

  describe('updateEntry', () => {
    it('should update a single occurrence of text', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Hello World' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          valueToUpdate: 'Hello',
          newValue: 'Hi',
          replaceAll: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Entry updated successfully.'
      });
    });

    it('should update all occurrences of text when replaceAll is true', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Hello World Hello' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          valueToUpdate: 'Hello',
          newValue: 'Hi',
          replaceAll: true
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Entry updated successfully.'
      });
    });

    it('should return error when text to update is not found', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Some content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          valueToUpdate: 'Nonexistent',
          newValue: 'New',
          replaceAll: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Text to update not found outside table region'
      });
    });
  });

  describe('deleteEntry', () => {
    it('should delete content successfully', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Content to delete' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          contentToDelete: 'Content to delete',
          deleteAllOccurance: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await deleteEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Entry deleted successfully.'
      });
    });

    it('should return error when content to delete is not found', async () => {
      // Mock document content
      docs.documents.get.mockResolvedValue({
        data: {
          body: {
            content: [
              {
                paragraph: {
                  elements: [{ textRun: { content: 'Some content' } }]
                }
              }
            ]
          }
        }
      });

      const req = {
        body: {
          contentToDelete: 'Nonexistent',
          deleteAllOccurance: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await deleteEntry(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Text to delete not found outside table region'
      });
    });
  });
}); 