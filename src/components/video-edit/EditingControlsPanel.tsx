
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Play } from 'lucide-react';
import TrimVideoControl from './TrimVideoControl';
import FilterVideoControl from './FilterVideoControl';
import SpeedVideoControl from './SpeedVideoControl';
import SubtitleVideoControl from './SubtitleVideoControl';
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type VideoJob = Database["public"]["Tables"]["video_jobs"]["Row"];
type VideoEditOperation = Database["public"]["Enums"]["video_edit_operation"];

interface EditingControlsPanelProps {
  video: VideoJob;
}

interface EditOperation {
  operation: VideoEditOperation;
  parameters: any;
}

const EditingControlsPanel = ({ video }: EditingControlsPanelProps) => {
  const [pendingEdits, setPendingEdits] = useState<EditOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addEditOperation = (operation: EditOperation) => {
    setPendingEdits(prev => [...prev, operation]);
    toast({
      title: "Edit added to queue",
      description: `${operation.operation} operation has been added to the batch.`,
    });
  };

  const handleTrimAdd = async (startTime: number, endTime: number) => {
    addEditOperation({
      operation: 'trim',
      parameters: { start_time: startTime, end_time: endTime }
    });
  };

  const handleFilterAdd = async (filterType: Database["public"]["Enums"]["video_filter_type"]) => {
    addEditOperation({
      operation: 'filter',
      parameters: { filter_type: filterType }
    });
  };

  const handleSpeedAdd = async (speed: number) => {
    addEditOperation({
      operation: 'speed',
      parameters: { speed_factor: speed }
    });
  };

  const handleSubtitleAdd = async (subtitleUrl: string) => {
    addEditOperation({
      operation: 'subtitle',
      parameters: { subtitle_url: subtitleUrl }
    });
  };

  const handleSubmitBatch = async () => {
    if (pendingEdits.length === 0) {
      toast({
        title: "No edits to process",
        description: "Add some edits to the queue first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: batchData, error: batchError } = await supabase
        .from('edit_batches')
        .insert({
          video_id: video.id,
          operations: pendingEdits,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (batchError) throw batchError;

      toast({
        title: "Batch processing started",
        description: "You'll be notified when the edits are complete.",
      });

      setPendingEdits([]);
    } catch (error) {
      console.error('Error submitting batch:', error);
      toast({
        title: "Error submitting edits",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="glass-panel space-y-6">
      <h2 className="text-2xl font-orbitron text-gradient bg-gradient-glow p-6 border-b border-white/10">
        Editing Controls
      </h2>
      <div className="p-6 space-y-6">
        <TrimVideoControl
          video={video}
          duration={video.duration}
          startTime={0}
          endTime={video.duration}
          onStartTimeChange={() => {}}
          onEndTimeChange={() => {}}
          onApplyTrim={handleTrimAdd}
          isProcessing={isProcessing}
        />

        <FilterVideoControl
          onApplyFilter={handleFilterAdd}
          isProcessing={isProcessing}
        />

        <SpeedVideoControl
          onApplySpeed={handleSpeedAdd}
          isProcessing={isProcessing}
        />

        <SubtitleVideoControl
          onApplySubtitles={handleSubtitleAdd}
          isProcessing={isProcessing}
        />

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Pending Edits</h3>
            <span className="text-sm text-gray-400">
              {pendingEdits.length} edit(s) queued
            </span>
          </div>

          <div className="space-y-2">
            {pendingEdits.map((edit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-black/30 border border-white/10"
              >
                <span className="capitalize text-aurora-blue">
                  {edit.operation}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPendingEdits(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple text-white shadow-neon"
            onClick={handleSubmitBatch}
            disabled={isProcessing || pendingEdits.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Edits...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Process All Edits
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EditingControlsPanel;
