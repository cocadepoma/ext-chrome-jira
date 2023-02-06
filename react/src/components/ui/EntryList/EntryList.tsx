import { FC } from "react";
import { EntryCard } from ".."
import { Entry } from "../../../interfaces";

interface Props {
  tickets: Entry[];
  setActiveDeleteTicket: (entry: Entry) => void;
  setActiveEditTicket: (entry: Entry) => void;
}

export const EntryList: FC<Props> = ({ tickets, setActiveDeleteTicket, setActiveEditTicket }) => {
  return (
    <>
      {
        tickets.map((entry, index) => (
          <EntryCard
            key={entry._id}
            entry={entry}
            index={index}
            setActiveDeleteTicket={setActiveDeleteTicket}
            setActiveEditTicket={setActiveEditTicket}
          />
        ))
      }
    </>
  )
}
