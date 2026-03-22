"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { InputRhf } from "@/components/RHF/InputRhf";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { TextareaRhf } from "@/components/RHF/TextareaRhf";

import { createPlace, updatePlace } from "@/app/api/places";
import { EMPTY_PLACE, TAG_OPTIONS, RATING_OPTIONS } from "@/app/places/data/constants";
import type { Place, PlaceFormValues } from "@/app/places/types";

interface PlaceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPlace?: Place | null;
  userId?: string;
}

interface PlaceFormInnerProps extends PlaceFormModalProps {
  editPlace?: Place | null;
}

const PlaceFormInner = ({ open, onClose, onSuccess, editPlace, userId }: PlaceFormInnerProps) => {
  const { control, handleSubmit } = useForm<PlaceFormValues>({
    defaultValues: editPlace
      ? { title: editPlace.title, memo: editPlace.memo, rating: editPlace.rating, tag: editPlace.tag }
      : EMPTY_PLACE,
  });

  const [image, setImage] = useState<{ file: File | null; preview: string | null }>({
    file: null,
    preview: editPlace?.imageUrl ?? null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage({
      file,
      preview: file ? URL.createObjectURL(file) : (editPlace?.imageUrl ?? null),
    });
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const createHandler = ({ data, file }: { data: PlaceFormValues; file: File | null }) =>
    createPlace(data, file, userId);

  const updateHandler = ({ data, file }: { data: PlaceFormValues; file: File | null }) =>
    updatePlace(editPlace!.id, data, file, userId);

  const createMutation = useMutation({ mutationFn: createHandler, onSuccess: handleSuccess });
  const updateMutation = useMutation({ mutationFn: updateHandler, onSuccess: handleSuccess });

  const onSubmit = (data: PlaceFormValues) => {
    if (editPlace) {
      updateMutation.mutate({ data, file: image.file });
    } else {
      createMutation.mutate({ data, file: image.file });
    }
  };

  const handleConfirm = async () => {
    await handleSubmit(onSubmit)();
  };

  const formContent = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-foreground mb-1">이미지 (선택)</p>
        <div
          className="w-full h-36 rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
          onClick={handleImageClick}
        >
          {image.preview ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image.preview})` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
              클릭하여 이미지 선택
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {image.preview && (
          <div className="mt-1.5">
            <Button mode="plain" onClick={handleImageClick}>
              이미지 변경
            </Button>
          </div>
        )}
      </div>

      <InputRhf
        control={control}
        name="title"
        label="제목"
        placeholder="장소 이름을 입력하세요"
        rules={{ required: "제목을 입력해주세요" }}
      />
      <SelectRhf
        control={control}
        name="tag"
        label="태그"
        options={TAG_OPTIONS}
        rules={{ required: true }}
      />
      <SelectRhf
        control={control}
        name="rating"
        label="별점"
        options={RATING_OPTIONS}
        valueAsNumber
        rules={{ required: true }}
      />
      <TextareaRhf
        control={control}
        name="memo"
        label="메모"
        placeholder="장소에 대한 메모를 입력하세요"
        rows={3}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={editPlace ? "장소 수정" : "장소 추가"}
      content={formContent}
      cancelButton="취소"
      confirmButton={editPlace ? "수정" : "추가"}
    />
  );
};

export const PlaceFormModal = (props: PlaceFormModalProps) => {
  const key = `${props.editPlace?.id ?? "new"}-${props.open}`;
  return <PlaceFormInner key={key} {...props} />;
};
