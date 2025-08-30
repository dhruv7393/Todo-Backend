## CATEGORY -

name: string
color: string
border: string
priority: number
done: number
notDone: number
total: number
tasks: array of TASK
isMarkedDone: boolean

## TASK -

name: string
notes: string
priority: number
done: boolean
canBeRepeated: boolean
when?: string

FUNCTIONALITY -
MARK AS DONE/ UNDONE -
For Task - 1. increase/ decrease done by 1 based on done/ undone 2. decrease/ increase notDone by 1 based on done/ undone 3. update done of task to true/ false based on done/ undone

    UPDATE PRIORITY OF TASK-
        1. If task is done, decrease priority of all task greater than current task by 1 and set current task priority to total
        2. If task is undone, increase priority of all done tasks by 1 and set current task priority to notDone
        3. If priority is changed,
            a. if new priority < old priority, increase priority of all tasks between new and old priority by 1
            b. if new priority > old priority, decrease priority of all tasks between old and new priority by 1
            c. set current category priority to new priority

    UPDATE PRIORITY OF CATEGORY -
        1. If all tasks are done -
            a. decrease priority of all categories greater than current category by 1
            b. set current category priority to total number of categories
            c. Set isMarkedDone to true if all tasks are done
        2. If any task is undone and isMarkedDone is true -
            a. increase priority of all categories with isMarkedDone as true by 1
            b. set current category priority highest priority among categories with isMarkedDone as false + 1
            c. Set isMarkedDone to false if isMarkedDone is true and any task is undone
        3. If priority is changed  -
            a. make sure that category / task is not marked done
            b. if new priority < old priority, increase priority of all categories between new and old priority by 1
            c. if new priority > old priority, decrease priority of all categories between old and new priority by 1
            d. set current category priority to new priority

    DELETE CATEGORY -
        1. Make sure that subtasks cannot be repeated
        2. Remove category from list of categories
        3. Decrease priority of all categories greater than current category by 1

    DELETE TASK -
        1. Remove task from list of tasks
        2. Decrease priority of all tasks greater than current by 1
        3. Reduce total by 1
        4. If task is done, reduce done by 1 else reduce notDone by 1

    ADD CATEGORY -
        1. Add new category to the list of categories
        2. Set priority of new category to total number of categories with isMarkedDone as false + 1
        3. Set isMarkedDone to false
        4. Increase priority of all categories with isMarkedDone as true by 1

    ADD / COPY TASK -
        1. Add new task to the list of tasks
        2. Set priority of new task to notDone + 1
        3. Increase total by 1
        4. Increase notDone by 1
        5. Increase priority of all done tasks by 1
