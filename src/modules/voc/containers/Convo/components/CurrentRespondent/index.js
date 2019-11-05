import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import user from 'Images/respondent.svg';

const CurrentRespondentWrapper = styled.div`
  height: calc(100vh - 60px);
  width: 80%;
  border: solid 1px #d9d9d9;
  display: flex;
  flex-direction: column;
  margin-right: 0;
  margin-left: auto;
`;

const ProfileImageWrapper = styled.div`
  width: 100%;
  min-height: 130px;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
`;

const ParticipantDetailsWrapper = styled.div`
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Lato;
  color: #6d6e71;
  border-top: solid 1px #d9d9d9;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: bold;
}
`;

const Location = styled.div`
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
`;

const Phone = Location.extend``;

const Email = Location.extend``;

const MemberSince = Location.extend``;

const CustomerType = Location.extend``;

const Rating = Location.extend``;

const BoldText = styled.span`
  font-weight: bold;
`;

const ContributionsAndRepliesWrapper = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Lato;
  color: #6d6e71;
  border-top: solid 1px #d9d9d9;
  padding: 10px 0 10px 0;
`;

const ContributionsWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #dbebf3;
`;

const ContributionValue = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const ContributionLabel = styled.div`
  font-size: 10px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.4px;
`;

const RepliesWrapper = ContributionsWrapper.extend``;

const ReplyValue = ContributionValue.extend``;

const ReplyLabel = ContributionLabel.extend``;

const PlatformsWrapper = styled.div`
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-top: solid 1px #d9d9d9;
  padding: 10px 0 10px 0;
`;

const Platform = styled.span`
  border: 3px solid #dbebf3;
`;

const Connected = styled.div`
  position: absolute;
  height: 11px;
  font-size: 9px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.3px;
  text-align: center;
  color: #808285;
`;

const AccountDetailsWrapper = styled.div`
  width: 100%;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  border-top: solid 1px #d9d9d9;
  align-items: start;
  justify-content: start;
  font-family: Lato;
  color: #6d6e71;
  padding: 20px 0 0 30px;
`;

const Header = BoldText.extend`
  padding-bottom: 10px;
`;

const SurveyHistoryWrapper = styled.div`
  width: 100%;
  min-height: 130px;
  display: flex;
  flex-direction: row;
  border-top: solid 1px #d9d9d9;
  align-items: start;
  justify-content: start;
  font-family: Lato;
  line-height: 2.08;
  font-size: 12px;
  color: #6d6e71;
  padding: 20px 0 0 30px;
`;

const SurveyDetails = styled.div`
  width: 60%;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;

const RepliedTo = styled.div`
  width: 40%;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-end;
  position: relative;
`;

const Replied = styled.button`
  height: 25px;
  border-radius: 17px;
  background-color: #ffffff;
  border: solid 1px #d9d9d9;
  padding: 0 20px 0 40px;
`;

const RedLabel = styled.span`
  width: 17px;
  height: 17px;
  border-radius: 4px;
  background-color: #f26b50;
  font-family: Lato;
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.92;
  letter-spacing: 0.5px;
  text-align: center;
  color: #ffffff;
  padding: 1px 5px 1px 5px;
`;

const GreenLabel = RedLabel.extend`
  background-color: #20ab9c;
`;

const History = Location.extend``;

const UserEngagementWrapper = styled.div`
  width: 100%;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  border-top: solid 1px #d9d9d9;
  align-items: start;
  justify-content: start;
  font-family: Lato;
  line-height: 2.08;
  font-size: 12px;
  color: #6d6e71;
  padding: 20px 0 0 30px;
`;

const LastSMS = Location.extend``;

const LastVisit = Location.extend``;

const PremisesVisited = Location.extend``;

const CurrentRespondent = (props) => {
  const { conversation: { commId }, isLoading, activeParticipantConversationId } = props;
  if (!activeParticipantConversationId) return null;

  return (
    <CurrentRespondentWrapper>
      {!commId && isLoading ?
        (<Dimmer active><Loader size="massive">Loading</Loader></Dimmer>)
        : (
      [
        <ProfileImageWrapper key="profile-image">
          <Image src={user} />
        </ProfileImageWrapper>,
        <ParticipantDetailsWrapper key="participant-details">
          <Name style={{ fontSize: 18, fontWeight: 'bold' }}>Mary Jane Doh</Name>
          <Location>Nairobi - Kenya</Location>
          <Phone><BoldText>Tel:</BoldText> +254 723 123 456</Phone>
        </ParticipantDetailsWrapper>,
        <ContributionsAndRepliesWrapper key="contributions-and-replies">
          <ContributionsWrapper>
            <ContributionValue>2</ContributionValue>
            <ContributionLabel>Contributions</ContributionLabel>
          </ContributionsWrapper>
          <RepliesWrapper>
            <ReplyValue>10</ReplyValue>
            <ReplyLabel>Replies</ReplyLabel>
          </RepliesWrapper>
        </ContributionsAndRepliesWrapper>,
        <PlatformsWrapper key="connected-platforms">
          {['facebook f', 'twitter', 'linkedin'].map((platform) => (
            <div style={{ position: 'relative', background: 'transparent' }} key={platform}>
              <Platform className={`ui ${platform} circular icon button platform`}>
                <i aria-hidden="true" className={`${platform} icon`} />
              </Platform>
              <span className="ui twitter circular icon button" style={{ position: 'absolute', top: -15, right: -15, transform: 'scale(0.5)' }}>
                <i aria-hidden="true" className="check icon" />
              </span>
              <Connected>Connected</Connected>
            </div>
          ))}
        </PlatformsWrapper>,
        <AccountDetailsWrapper key="account-details">
          <Header>Account Details</Header>
          <Email><BoldText>Email:</BoldText> mm@gmail.com</Email>
          <MemberSince><BoldText>Member Since:</BoldText> 14 Jun 17, 8:05pm</MemberSince>
          <CustomerType><BoldText>Customer Type:</BoldText> Contributer</CustomerType>
          <Rating><BoldText>Rating:</BoldText></Rating>
        </AccountDetailsWrapper>,
        <SurveyHistoryWrapper key="survey-history">
          <SurveyDetails>
            <Header style={{ fontSize: 14 }}>Survey History</Header>
            <History>
              <RedLabel>5</RedLabel> 14 Jun 17, 8:05pm
            </History>
            <History>
              <GreenLabel>8</GreenLabel> 10 Nov 17, 8:05pm
            </History>
          </SurveyDetails>
          <RepliedTo>
            <Replied>
              Replied
            </Replied>
            <span className="ui circular icon button" style={{ position: 'absolute', bottom: -5, left: -5, transform: 'scale(0.5)' }}>
              <i aria-hidden="true" className="reply icon" />
            </span>
          </RepliedTo>
        </SurveyHistoryWrapper>,
        <UserEngagementWrapper key="user-engagement">
          <Header style={{ fontSize: 14 }}>User Engagement</Header>
          <LastSMS><BoldText>Last SMS:</BoldText> 20 min ago</LastSMS>
          <LastVisit><BoldText>Last Visit:</BoldText> 1 week ago</LastVisit>
          <PremisesVisited>
            <BoldText>Premises Visited:</BoldText> 3<br />
            <p>Java Kimathi Street - Monday, 8 Dec 2017</p>
            <p>Java Hurligham - Sunday, 19 Jan 2018</p>
            <p>Java Hurligham - Saturday, 23 Feb 2018</p>
          </PremisesVisited>
        </UserEngagementWrapper>,
      ]
        )
      }
    </CurrentRespondentWrapper>
  );
};

CurrentRespondent.propTypes = {
  activeParticipantConversationId: PropTypes.number,
  conversation: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

export default CurrentRespondent;
