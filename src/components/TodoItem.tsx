/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  loadingTodoId: number | null;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Omit<Todo, 'userId'>) => void;
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  loadingTodoId,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmedTitle = editedTitle.trim();

    setIsEditing(false);

    if (trimmedTitle === title) {
      return;
    }

    if (trimmedTitle === '') {
      onDelete(id);

      return;
    }

    onUpdate({
      id,
      title: editedTitle.trim(),
      completed,
    });
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({ id, title, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={inputRef}
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedTitle(title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            style={loadingTodoId === id ? { textDecoration: 'none' } : {}}
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {id === 0 || loadingTodoId !== id
              ? title
              : editedTitle !== title
                ? editedTitle
                : 'Todo is being saved now'}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
