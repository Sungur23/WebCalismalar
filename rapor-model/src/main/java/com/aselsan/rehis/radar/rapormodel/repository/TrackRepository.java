package com.aselsan.rehis.radar.rapormodel.repository;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackRepository extends JpaRepository<TrackModel, Long> {
}
