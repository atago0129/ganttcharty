import * as uuid from 'uuid';
import * as State from '../../state';

export const selectTask = (taskId: State.Task.TaskId | undefined) => {
  State.update(state => {
    state.selectedTaskId = taskId;
  });
};

export const selectNextTask = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;
    const next = State.Task.getNext(state.tasks, state.selectedTaskId);
    if (next) {
      state.selectedTaskId = next.id;
    }
  });
};

export const selectPrevTask = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;
    const prev = State.Task.getPrev(state.tasks, state.selectedTaskId);
    if (prev) {
      state.selectedTaskId = prev.id;
    }
  });
};

export const expand = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;
    const selected = State.Task.getTask(state.tasks, state.selectedTaskId)!;
    if (selected) {
      selected.collapsed = false;
    }
  });
};

export const collapse = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;
    const selected = State.Task.getTask(state.tasks, state.selectedTaskId)!;
    if (selected) {
      selected.collapsed = true;
    }
  });
};

export const add = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;

    // create newTask and extends selected task.
    const selected = State.Task.getTask(state.tasks, state.selectedTaskId)!;
    const newTask: State.Task.Task = {
      id: uuid.v4(),
      name: 'new task',
      description: '',
      startedAt: new Date(Date.now()),
      finishedAt: new Date(Date.now() + State.Option.scaleTime(state.option.scale)),
      parentId: selected.parentId
    };

    // insert newTask to next to selected task.
    state.tasks.splice(
      state.tasks.indexOf(selected) + 1,
      0,
      newTask
    );

    // select newTask.
    state.selectedTaskId = newTask.id;
  });
};

export const deleteSelectedTask = () => {
  State.update(state => {
    if (!state.selectedTaskId) return;

    // memory target to move.
    const prev = State.Task.getPrev(state.tasks, state.selectedTaskId);
    const next = State.Task.getNext(state.tasks, state.selectedTaskId);

    // remove selected task.
    const target = State.Task.getTask(state.tasks, state.selectedTaskId)!;
    state.tasks.splice(
      state.tasks.indexOf(target),
      1
    );

    // move to target.
    if (next) {
      state.selectedTaskId = next.id;
    } else if (prev) {
      state.selectedTaskId = prev.id;
    }

    // clear selecting if remove last task.
    if (state.tasks.length === 0) {
      state.selectedTaskId = undefined;
    }
  });
};

