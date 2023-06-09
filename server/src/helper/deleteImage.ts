var fs = require("file-system").promises;

const deleteImage = async (userImagePath: any) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);

  } catch (error) {
    
  }
};
export { deleteImage };
