var fs = require("file-system").promises;

const deleteImage = async (userImagePath: any) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("User Image is Deleted");
  } catch (error) {
    console.log("User image not found");
  }
};
export { deleteImage };
