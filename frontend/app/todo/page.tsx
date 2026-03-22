'use client';

import { useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TodoCalendar from './_components/TodoCalendar';
import TodoList from './_components/TodoList';
import TodoDetailModal from './_components/TodoDetailModal';
import AddTodoModal from './_components/AddTodoModal';
import { PageContainer } from '@/components/PageContainer';
import { NoTripSelected } from '@/components/NoTripSelected';
import { useTrip } from '@/app/contexts/TripContext';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/app/api/todos';
import type { TodoItem } from './types';

dayjs.locale('ko');

const TodoPage = () => {
  const { currentTrip } = useTrip();
  const tripId = currentTrip?.id;
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos', tripId],
    queryFn: () => fetchTodos(tripId!),
    enabled: !!tripId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['todos', tripId] });

  const createMutation = useMutation({
    mutationFn: (data: Omit<TodoItem, 'id' | 'completed'>) => createTodo(tripId!, data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TodoItem> }) => updateTodo(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: invalidate,
  });

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<TodoItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const itemDates = useMemo(() => [...new Set(todos.map((t) => t.visitDate))], [todos]);

  const selectedItems = useMemo(
    () => (selectedDate ? todos.filter((t) => t.visitDate === selectedDate) : []),
    [todos, selectedDate]
  );

  const handleItemClick = (item: TodoItem) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleToggleComplete = (id: string) => {
    const item = todos.find((t) => t.id === id);
    if (item) updateMutation.mutate({ id, data: { completed: !item.completed } });
    setDetailItem((prev) => (prev?.id === id ? { ...prev, completed: !prev.completed } : prev));
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    setDetailOpen(false);
  };

  const handleAddTodo = (data: Omit<TodoItem, 'id' | 'completed'>) => {
    createMutation.mutate(data);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const handleMonthChange = (month: Dayjs) => {
    setCurrentMonth(month);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleAddClick = () => {
    setAddOpen(true);
  };

  const handleMonthlySummaryClick = (visitDate: string) => {
    setSelectedDate(visitDate);
    setCurrentMonth(dayjs(visitDate));
  };

  const STATS = [
    { label: '전체 일정', value: todos.length, color: 'text-primary', bg: 'bg-lighter' },
    { label: '완료', value: todos.filter((t) => t.completed).length, color: 'text-light', bg: 'bg-[#F0FDF4]' },
    { label: '미완료', value: todos.filter((t) => !t.completed).length, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
  ];

  const monthItems = todos.filter((t) =>
    t.visitDate.startsWith(currentMonth.format('YYYY-MM'))
  );

  if (!currentTrip) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-foreground mb-6">여행 일정</h1>
        <NoTripSelected />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">여행 일정</h1>
        <p className="text-sm text-text-secondary mt-1">방문 장소와 일정을 관리하세요.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-3 text-center border border-border`}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-72 shrink-0">
          <TodoCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            itemDates={itemDates}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
          />

          {/* <div className="mt-4 bg-card rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-text-secondary mb-2">
              {currentMonth.format('M월')} 일정 요약
            </p>
            {monthItems.length === 0 ? (
              <p className="text-xs text-text-secondary">이 달의 일정이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {monthItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMonthlySummaryClick(item.visitDate)}
                    className="flex items-center gap-2 text-left hover:bg-lighter rounded-lg px-2 py-1 transition-colors"
                  >
                    <span className="text-xs text-text-secondary w-8 shrink-0">
                      {dayjs(item.visitDate).format('D일')}
                    </span>
                    <span className="text-xs text-foreground font-medium truncate">{item.name}</span>
                  </button>
                ))}
                {monthItems.length > 4 && (
                  <p className="text-xs text-text-secondary pl-2">+{monthItems.length - 4}개 더</p>
                )}
              </div>
            )}
          </div> */}
        </div>

        <div className="flex-1">
          <TodoList
            selectedDate={selectedDate}
            items={selectedItems}
            allItems={todos}
            onItemClick={handleItemClick}
            onAddClick={handleAddClick}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>

      <TodoDetailModal
        item={detailItem}
        open={detailOpen}
        onClose={handleDetailClose}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />

      <AddTodoModal
        open={addOpen}
        onClose={handleAddClose}
        onAdd={handleAddTodo}
        defaultDate={selectedDate ?? undefined}
      />
    </PageContainer>
  );
};

export default TodoPage;
