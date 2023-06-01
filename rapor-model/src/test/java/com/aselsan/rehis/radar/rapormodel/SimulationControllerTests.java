package com.aselsan.rehis.radar.rapormodel;

import com.aselsan.rehis.radar.rapormodel.endpoint.SimulationController;
import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.model.builder.TrackModelBuilder;
import com.aselsan.rehis.radar.rapormodel.service.TrackSimulationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.util.EntityUtils;
import org.junit.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.mockito.Mockito.*;


@WebMvcTest(SimulationController.class)
public class SimulationControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TrackSimulationService trackSimulationService;
    private ObjectMapper mapper;
    private static final String hostname = "http://localhost:3001";
    @BeforeEach
    public void setUp(){

        mapper = new ObjectMapper();

    }

    @Test
    // api call yapildigi icin rapor-model mikroservisinin ayakta olmasi gerekli
    public void getAllTracksFromEndpoint() throws Exception{
        System.out.println("getAllTracksFromEndpoint test started.");
        // Gerçek bir endpoint URL'si
        String url = hostname + "/api/v1/simulation/track/tracksDB";
        // HttpClient oluşturma
        HttpClient httpClient = HttpClientBuilder.create().build();
        // GET isteği oluşturma
        HttpGet request = new HttpGet(url);
        // İstek gönderme ve yanıt alma
        HttpResponse response = httpClient.execute(request);

        assertNotNull(response);

        String result = EntityUtils.toString(response.getEntity(), "UTF-8");

        assertNotNull(result);
        assertEquals(200, response.getStatusLine().getStatusCode(), "HTTP response OK 200 degil");

        List<TrackModel> responseList = mapper.readValue(result, List.class);

        assertNotNull(responseList);
        assertTrue(responseList.size() > 0, "DB boş!");

    }
    @Test
    public void getAllTracksFromMockMvc() throws Exception{
        System.out.println("getAllTracksFromMockMvc test started.");

        when(trackSimulationService.getTracksfromDB()).thenReturn(Arrays.asList(createTrack()));

        // GET request
        MockHttpServletResponse mockResponse = mockMvc.perform(get("/api/v1/simulation/track/tracksDB"))
                .andExpect(status().isOk())
                .andReturn().getResponse();

        assertEquals(200, mockResponse.getStatus(), "HTTP response OK 200 degil");
        assertNotNull(mockResponse.getContentAsString());

        List<TrackModel> responseList = mapper.readValue(mockResponse.getContentAsString(), List.class);

        assertNotNull(responseList);
        assertTrue(responseList.size() > 0, "Test DB boş!");

    }

    private TrackModel createTrack(){
        return new TrackModelBuilder()
                .setAzimuth(15.0)
                .setRange(1000.0)
                .setElevation(20.0)
                .build();
    }

}
