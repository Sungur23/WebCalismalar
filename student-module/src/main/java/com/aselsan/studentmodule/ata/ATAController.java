package com.aselsan.studentmodule.ata;

import com.aselsan.rehis.RSY.RSY_Gorev.RSY_Gorev;
import com.aselsan.rehis.reform.haberlesme.Connector;
import com.aselsan.rehis.reform.haberlesme.ConnectorObserver;
import com.aselsan.rehis.reform.haberlesme.Stream;
import com.aselsan.rehis.reform.haberlesme.tcp.ConnectorTCPServer;
import com.aselsan.studentmodule.student.Student;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/ata")
public class ATAController {

    @GetMapping("/isimaBaslat")
    public List<Student> getStudents() {
        System.err.println("ATA kuruldu");
        SYListener syListener = new SYListener();
        int port = 7600;
        ConnectorTCPServer tcpServer = new ConnectorTCPServer(port);
        tcpServer.setKeepAlive(true);
        tcpServer.addObserver(new ConnectorObserver() {
            @Override
            public void connected(Connector connector, Stream stream) {
                System.err.println("Baglanti kuruldu");
            }

            @Override
            public void couldNotConnect(Connector connector) {

                System.err.println("couldNotConnect");
            }

            @Override
            public void disconnected(Connector connector, Stream stream) {

                System.err.println("disconnected");
            }
        });

        RSY_Gorev ata = new RSY_Gorev(tcpServer);
        ata.itsIGB_Gorev = new SYListener();
        ata.iLogSeviyesi=2;
        ata.haberlesmeyeBasla();

        return null;
    }

}
