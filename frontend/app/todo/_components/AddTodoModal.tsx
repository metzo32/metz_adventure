'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/Modal';
import { ButtonsRhf } from '@/components/RHF/ButtonsRhf';
import { InputRhf } from '@/components/RHF/InputRhf';
import { TextareaRhf } from '@/components/RHF/TextareaRhf';
import { DatePickerRhf } from '@/components/RHF/DatePickerRhf';
import { TimePickerRhf } from '@/components/RHF/TimePickerRhf';
import { TodoItem } from '../types';
import { CATEGORY_OPTIONS } from '../data';

type FormData = Omit<TodoItem, 'id' | 'completed'>;

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => void;
  defaultDate?: string;
}


const AddTodoModal = ({ open, onClose, onAdd, defaultDate }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      category: 'attraction',
      visitDate: defaultDate || '',
      visitTime: '12:00',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        category: 'attraction',
        visitDate: defaultDate || '',
        visitTime: '12:00',
        name: '',
        address: '',
        mapUrl: '',
        memo: '',
      });
    }
  }, [open, defaultDate, reset]);

  const onSubmit = (data: FormData) => {
    onAdd(data);
    onClose();
  };

  const handleConfirm = () => handleSubmit(onSubmit)();

  const formContent = (
    <form className="flex flex-col gap-4">
      <ButtonsRhf control={control} name="category" label="카테고리" options={CATEGORY_OPTIONS} />

      <InputRhf
        control={control}
        name="name"
        label="장소명"
        placeholder="예) 도이수텝 사원"
        rules={{ required: '장소명을 입력해주세요' }}
      />

      <div className="grid grid-cols-2 gap-3">
        <DatePickerRhf
          control={control}
          name="visitDate"
          label="방문 날짜"
          rules={{ required: '날짜를 선택해주세요' }}
        />
        <TimePickerRhf
          control={control}
          name="visitTime"
          label="방문 시간"
        />
      </div>

      <InputRhf
        control={control}
        name="address"
        label="주소"
        placeholder="예) Doi Suthep, Chiang Mai"
      />

      <InputRhf
        control={control}
        name="mapUrl"
        label="지도 링크 (Google Maps URL)"
        placeholder="https://maps.google.com/..."
        hint="Google Maps에서 공유 링크를 복사해 붙여넣으세요"
      />

      <TextareaRhf
        control={control}
        name="memo"
        label="메모"
        placeholder="방문 전 알아둘 것, 준비물 등..."
        rows={3}
      />
    </form>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="일정 추가"
      content={formContent}
      cancelButton="취소"
      confirmButton="추가하기"
    />
  );
};

export default AddTodoModal;
