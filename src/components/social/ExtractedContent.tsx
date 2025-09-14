import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ExtractedContentProps {
  sections: string[];
}

export const ExtractedContent: React.FC<ExtractedContentProps> = ({
  sections,
}) => {
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null,
  );
  const [editedText, setEditedText] = useState<string>("");
  const [displaySections, setDisplaySections] = useState<string[]>(sections);

  const handleStartEditing = (index: number) => {
    setEditingSectionIndex(index);
    setEditedText(displaySections[index]);
  };

  const handleSaveEdit = () => {
    if (editingSectionIndex !== null) {
      const updatedSections = [...displaySections];
      updatedSections[editingSectionIndex] = editedText;
      setDisplaySections(updatedSections);
      setEditingSectionIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSectionIndex(null);
  };

  const handleDeleteSection = (index: number) => {
    const updatedSections = [...displaySections];
    updatedSections.splice(index, 1);
    setDisplaySections(updatedSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Extracted Content</h3>
        <div className="text-sm text-gray-400">
          {displaySections.length} sections available
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList className="grid grid-cols-2 w-48">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4 pt-4">
          {displaySections.map((section, index) => (
            <Card key={index} className="overflow-hidden border-gray-700">
              <CardContent className="p-0">
                {editingSectionIndex === index ? (
                  <div className="p-4 space-y-4">
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-sm text-gray-200">{section}</p>
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEditing(index)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSection(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <div className="p-4 bg-gray-800 rounded-lg overflow-y-auto max-h-96">
                {displaySections.map((section, index) => (
                  <React.Fragment key={index}>
                    <p className="text-gray-200 mb-4">{section}</p>
                    {index < displaySections.length - 1 && (
                      <hr className="border-gray-700 my-4" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
