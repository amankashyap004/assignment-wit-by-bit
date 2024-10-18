import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddCategoryModalProps {
  onAddCategory: (categoryName: string) => void;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  onAddCategory,
  onClose,
}) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory) {
      onAddCategory(newCategory);
      setNewCategory("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="space-y-2 bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>
        <Label className="">Category Name *</Label>
        <Input
          type="text"
          placeholder="Category Name"
          className="!mb-4"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button
            className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-6"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1F8CD0] text-white hover:bg-[#E1E7EB] hover:text-[#1F8CD0] px-6"
            onClick={handleAddCategory}
            disabled={!newCategory}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
