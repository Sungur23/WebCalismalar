package com.aselsan.studentmodule.ata;

import com.aselsan.rehis.RSY.RSY_Gorev.IGB_Gorev;
import com.aselsan.rehis.Tipler.*;

public class SYListener implements IGB_Gorev {

    @Override
    public void MissionSegmentRSY(PacketHeaderStruct stPacketHeader, MissionSegmentStruct stMissionSeg) {
        System.err.println("MissionSegmentRSY mesaji geldi");
    }

    @Override
    public byte[] MissionSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, MissionSegmentStruct stMissionSeg) {
        return new byte[0];
    }

    @Override
    public void TestAndStatusSegmentRSY(PacketHeaderStruct stPacketHeader, TestAndStatusSegmentStruct stTestAndStatusSeg) {

    }

    @Override
    public byte[] TestAndStatusSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, TestAndStatusSegmentStruct stTestAndStatusSeg) {
        return new byte[0];
    }

    @Override
    public void TestAndStatusDetailSegmentRSY(PacketHeaderStruct stPacketHeader, TestAndStatusDetailSegmentStruct stTestAndStatusDetailSeg) {

    }

    @Override
    public byte[] TestAndStatusDetailSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, TestAndStatusDetailSegmentStruct stTestAndStatusDetailSeg) {
        return new byte[0];
    }

    @Override
    public void PlatformLocationSegmentRSY(PacketHeaderStruct stPacketHeader, PlatformLocationSegmentStruct stPlatformLocationSeg) {

    }

    @Override
    public byte[] PlatformLocationSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, PlatformLocationSegmentStruct stPlatformLocationSeg) {
        return new byte[0];
    }

    @Override
    public void JobAcknowledgeSegmentRSY(PacketHeaderStruct stPacketHeader, JobAcknowledgeSegmentStruct stJobAcknowledgeSeg, SegmentHeaderStruct stSegmentHeader, Type106SegmentStruct stType106Seg) {

    }

    @Override
    public byte[] JobAcknowledgeSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, JobAcknowledgeSegmentStruct stJobAcknowledgeSeg, SegmentHeaderStruct stSegmentHeader, Type106SegmentStruct stType106Seg) {
        return new byte[0];
    }

    @Override
    public void JobDefinitionSegmentRSY(PacketHeaderStruct stPacketHeader, JobDefinitionSegmentStruct stJobDefinitionSeg, SegmentHeaderStruct stSegmentHeader, Type107SegmentStruct stType107Seg) {

    }

    @Override
    public byte[] JobDefinitionSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, JobDefinitionSegmentStruct stJobDefinitionSeg, SegmentHeaderStruct stSegmentHeader, Type107SegmentStruct stType107Seg) {
        return new byte[0];
    }

    @Override
    public void DwellReportSegmentRSY(PacketHeaderStruct stPacketHeader, DwellReportSegmentStruct stDwellSeg, SegmentHeaderStruct stSegmentHeaderEk2, JammerTrackFileParametersStruct stJammerTrackReport) {

    }

    @Override
    public byte[] DwellReportSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, DwellReportSegmentStruct stDwellSeg, SegmentHeaderStruct stSegmentHeaderEk2, JammerTrackFileParametersStruct stJammerTrackReport) {
        return new byte[0];
    }

    @Override
    public void TrackRequestACKSegmentRSY(PacketHeaderStruct stPacketHeader, TrackRequestAckSegmentStruct stTrackAcknowledgeSeg) {

    }

    @Override
    public byte[] TrackRequestACKSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, TrackRequestAckSegmentStruct stTrackAcknowledgeSeg) {
        return new byte[0];
    }

    @Override
    public void TrackReportSegmentRSY(PacketHeaderStruct stPacketHeader, TrackReportSegmentStruct stTrackReportSeg) {

    }

    @Override
    public byte[] TrackReportSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, TrackReportSegmentStruct stTrackReportSeg) {
        return new byte[0];
    }

    @Override
    public void MissileGuidanceInitializationSegmentRSY(PacketHeaderStruct stPacketHeader, MissileGuidanceInitializationSegmentStruct stMissileGuidanceInitializationSeg) {

    }

    @Override
    public byte[] MissileGuidanceInitializationSegmentRSYToByteArray(PacketHeaderStruct stPacketHeader, MissileGuidanceInitializationSegmentStruct stMissileGuidanceInitializationSeg) {
        return new byte[0];
    }
}
