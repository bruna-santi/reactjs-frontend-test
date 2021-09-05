import React, { useState } from 'react';
import { RiUserAddLine } from 'react-icons/ri';
import { MdSend } from 'react-icons/md';
import { HiOutlineUserRemove } from 'react-icons/hi';
import TextField from '@material-ui/core/TextField';
import Cookies from 'universal-cookie';
import {
    WebinarContainer,
    LeftContainer,
    HeaderContainer,
    Logo,
    TitleContainer,
    Title,
    Wrap,
    BgVideo,
    MainVideo,
    ParticipantsVideoContainer,
    ParticipantsBox,
    ParticipantsData,
    ParticipantVideo,
    ParticipanteName,
    MenuContainer,
    MenuItemContainer,
    RigthContainer,
    HeaderChat,
    ChatContainerBody,
    MessageContainer,
    MessageImage,
    MessageContentContainer,
    MessageParticipantName,
    Message,
    MessageChatContainer,
    MessageChat,
    MessageButton,
} from "./styles";
import JoinParticipantContainer from '../Webinar/components/JoinParticipantContainer'
import { chatMessages, menuIconsList, participants } from './data';
import { FaRegWindowClose } from 'react-icons/fa';
import { CgScreen } from 'react-icons/cg';
import ParticipantAllowedMessageContainer from './components/ParticipantAllowedMessageContainer';
import ParticipantButtonsContainer from './components/ParticipantButtonsContainer';

interface IMeetingParticipant {
    id: number;
    name: string;
    image: string;
    isVideoOn: boolean;
}

const Webinar: React.FC = () => {
    const getInitialParticipants = () => {
        const participantsFromCurrentMeeting = localStorage.getItem('participants')
        if (participantsFromCurrentMeeting !== null) {
            const currentParticipantIds = JSON.parse(participantsFromCurrentMeeting).ids
            const initialParticipants = participants.filter((participant) => currentParticipantIds.includes(participant.id))
            return initialParticipants
        }
        return []
    }
    const [meetingParticipants, setMeetingParticipants] = useState<IMeetingParticipant[]>(getInitialParticipants())
    const [messageContent, setMessageContent] = useState("")
    const [chatMessagesList, setChatMessagesList] = useState(chatMessages)
    const [isMainVideoOn, setIsMainVideoOn] = useState(true)
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false)
    const [isShareScreenOn, setIsShareScreenOn] = useState(true)
    const [isVolumeOn, setIsVolumeOn] = useState(false)
    const [participantWantsJoin, setParticipantWantsJoin] = useState(false)
    const [paticipantAllowedMessage, setPaticipantAllowedMessage] = useState("")
    const [participantWasAllowed, setParticipantWasAllowed] = useState(false)
    const [isShowRemoveUser, setIsShowRemoveUser] = useState(false)
    const [participantIdHover, setParticipantIdHover] = useState(0)

    window.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
            setPaticipantAllowedMessage("")
            setParticipantWantsJoin(true)
        }
    });

    window.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'X') {
            setChatMessagesList([...chatMessagesList, {content: messageContent, participantName: "Participante 2"}])

        }
    });

    const addMessage = () => {
        if(messageContent !== "") {
            setChatMessagesList([...chatMessagesList, {content: messageContent, participantName: "Participante 1"}])
            setMessageContent("")
        }
    }

    const handleClickMenuIcon = (handleFunction: string) => {
        switch (handleFunction) {
            case "handleCamera":
                setIsMainVideoOn(!isMainVideoOn);
                break;
            case "handleAudio":
                setIsMicrophoneOn(!isMicrophoneOn);
                break;
            case "handleShareScreen":
                setIsShareScreenOn(!isShareScreenOn);
                break;
            case "handleVolume":
                setIsVolumeOn(!isVolumeOn);
                break;
            case "handleExit":
                handleExit();
                break;
        }
    }

    const checkState = (state: string) => {
        switch (state) {
            case "isVideoOn":
                return isMainVideoOn
            case "isMicrophoneOn":
                return isMicrophoneOn
            case "isShareScreenOn":
                return isShareScreenOn
            case "isVolumeOn":
                return isVolumeOn
        }
    }

    const handleAllowParticipantJoin = (allowed: boolean) => {
        if(allowed && meetingParticipants.length < 12) {
            setParticipantWantsJoin(false)
            const newParticipantId = meetingParticipants.length+1
            setMeetingParticipants([...meetingParticipants, participants[meetingParticipants.length]])
            setPaticipantAllowedMessage("Participante entrou na sala")
            setParticipantWasAllowed(true)
            setTimeout(() => setPaticipantAllowedMessage(""), 5000)
            const participantsIds = meetingParticipants.map((participant) => participant?.id)
            localStorage.setItem('participants', JSON.stringify({ids: [...participantsIds, newParticipantId]}))
        } else if (!allowed) {
            setParticipantWantsJoin(false)
            setPaticipantAllowedMessage("Participante foi recusado")
            setParticipantWasAllowed(false)
            setTimeout(() => setPaticipantAllowedMessage(""), 5000)
        }
    }

    const handleMouseEnter = (participantId: number) => {
        setParticipantIdHover(participantId)
        setIsShowRemoveUser(true)
    }

    const handleMouseLeave = () => {
        setIsShowRemoveUser(false)
    }

    const handleRemoveParticipant = (participantId: number) => {
        if(window.confirm("Deseja remover participante?")) {
            const filteredParticipants = meetingParticipants.filter((participant) => participant.id !== participantId)
            setMeetingParticipants(filteredParticipants)
            const participantsIds = filteredParticipants.map((participant) => participant.id)
            localStorage.setItem('participants', JSON.stringify({ids: participantsIds}))
        }
    }

    const handleParticipantVideoToggle = (participantId: number) => {
        const newParticipantsArray = meetingParticipants.map((participant) => {
            if(participant.id === participantId) {
                participant.isVideoOn = !participant.isVideoOn
            }
            return participant
        })
        setMeetingParticipants(newParticipantsArray)
    }

    const handleExit = () => {
        const cookie = new Cookies()
        cookie.remove("auth_token")
        localStorage.removeItem("participants")
        if(window.confirm("Deseja sair da reunião?")) {
            window.location.assign('/login');
        }
    }

    return (
        <WebinarContainer>
            <LeftContainer>
                <HeaderContainer>
                    <Logo src="logo.png" alt="logo" />
                    <TitleContainer>
                        <Title>
                            <span>UX/UI Design Conference Meeting</span>
                        </Title>
                            {participantWantsJoin &&
                                <JoinParticipantContainer handleAllowParticipantJoin={handleAllowParticipantJoin}/>  
                            }
                            {paticipantAllowedMessage !== "" &&
                                <ParticipantAllowedMessageContainer
                                    participantWasAllowed={participantWasAllowed}
                                    paticipantAllowedMessage={paticipantAllowedMessage}
                                />
                            }  
                    </TitleContainer>
                </HeaderContainer>
                <Wrap>
                    <BgVideo>
                        <MainVideo src={isMainVideoOn ? "video.mp4": ""} muted autoPlay loop/>
                    </BgVideo>

                    <ParticipantsVideoContainer>
                        {meetingParticipants.map((participant) => {
                            return (
                                <ParticipantsBox
                                    key={`${participant.name} - ${participant.id}`}
                                    onMouseEnter={() => handleMouseEnter(participant.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {(isShowRemoveUser && participant.id === participantIdHover) &&
                                        <ParticipantButtonsContainer
                                            participant={participant}
                                            handleParticipantVideoToggle={handleParticipantVideoToggle} 
                                            handleRemoveParticipant={handleRemoveParticipant}
                                        />
                                    }
                                    <ParticipantsData>
                                        <ParticipantVideo src={participant.isVideoOn ? participant.image : ""} muted autoPlay loop/>
                                        <ParticipanteName>{participant.name}</ParticipanteName>
                                    </ParticipantsData>
                                </ParticipantsBox>
                            )
                        })}
                    </ParticipantsVideoContainer>
                </Wrap>

                <MenuContainer>
                    { menuIconsList.map((menuIcon) => {
                        if(checkState(menuIcon.state)) {
                            return (
                                <MenuItemContainer>
                                    < menuIcon.icon
                                        size={menuIcon.size}
                                        color={menuIcon.color}
                                        className="menuIcon"
                                        onClick={() => handleClickMenuIcon(menuIcon.handleClick)}
                                        title={menuIcon.tooltip}
                                    />
                                </MenuItemContainer>
                            )
                        } else {
                            return (
                                <MenuItemContainer>
                                    < menuIcon.iconOff
                                        size={menuIcon.size}
                                        color={menuIcon.color}
                                        className="menuIcon"
                                        onClick={() => handleClickMenuIcon(menuIcon.handleClick)}
                                        title={menuIcon.tooltip}
                                    />
                                </MenuItemContainer>
                            )
                        }
                    })}
                </MenuContainer>    
            </LeftContainer> 
            <RigthContainer>
                <HeaderChat>
                    <p>Chat</p>
                </HeaderChat>
                <ChatContainerBody>
                    {chatMessagesList.map((message) => {
                        return (
                            <MessageContainer>
                                <MessageImage src="bruna.jpeg" alt={message.participantName} />
                                <MessageContentContainer>
                                    <MessageParticipantName>{message.participantName}</MessageParticipantName>
                                    <Message>{message.content}</Message>
                                </MessageContentContainer>
                            </MessageContainer>
                        )
                    })}
                </ChatContainerBody>
                <MessageChatContainer>
                    <MessageChat>
                        <TextField
                            className="inputMessage"
                            value={messageContent}
                            id="outlined-basic"
                            label="Escreva sua mensagem"
                            variant="outlined"
                            size="small"
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <MessageButton onClick={() => addMessage()}><MdSend size={20}/></MessageButton>
                    </MessageChat>
                </MessageChatContainer>
            </RigthContainer>
        </WebinarContainer>
    )
}

export default Webinar;