'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ListWithCards } from '@/types';
import ListForm from './ListForm';
import ListItem from './ListItem';
import { useAction } from '@/hooks/useAction';
import { UpdateListOrder } from '@/actions/update-list-order/schema';
import { updateListOrder } from '@/actions/update-list-order';
import { toast } from 'sonner';
import { updateCardOrder } from '@/actions/update-card-order';

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(
    updateListOrder,
    {
      onSuccess: () => {
        toast.success('List Reorderd');
      },

      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeUpdateCardOrder } = useAction(
    updateCardOrder,
    {
      onSuccess: () => {
        toast.success('Card Reorderd');
      },

      onError: (error) => {
        toast.error(error);
      },
    }
  );

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDrageEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //if Dropped in the same position

    if (
      destination.droppableId === source.dropabbleId &&
      destination.index === source.index
    ) {
      return;
    }

    //user moves a list

    if (type === 'list') {
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // user moves a card

    if (type === 'card') {
      let newOrderedData = [...orderedData];
      //source and destination list

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // check if card exists on source list

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }
      //moving the card in same list

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards,
        });

        //user moves card to another list
      } else {
        // Remove card from source list

        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;

        destList.cards.splice(destination.index, 0, movedCard);
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        //update the order for each card in destination list

        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDrageEnd}>
      <Droppable
        droppableId="lists"
        type="list"
        direction="horizontal"
      >
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
