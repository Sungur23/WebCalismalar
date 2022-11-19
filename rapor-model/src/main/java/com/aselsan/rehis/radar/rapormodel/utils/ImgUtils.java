package com.aselsan.rehis.radar.rapormodel.utils;

import com.aselsan.rehis.radar.rapormodel.model.PPILineModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;


import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;


public class ImgUtils {

    @Autowired
    private static ResourceLoader resourceLoader;

    public static BufferedImage imajYukle(String dosyaAdi) {
        return imajYukle("./simulation/", dosyaAdi);
    }

    public static BufferedImage imajYukle(String dizin, String dosyaAdi) {
        BufferedImage image = null;
        try {
            image = new BufferedImage(1, 1, BufferedImage.TYPE_4BYTE_ABGR);

            Resource resource = new ClassPathResource(dizin + dosyaAdi);
            InputStream input = resource.getInputStream();

            File file = resource.getFile();

            if (!file.exists()) {
                System.err.println("KGU: " + file.getPath() + " kaynagina erisilemiyor.");
            } else {
                image = ImageIO.read(file);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return image;

    }

    // Butun resmi baska bir referans resim icine kaydirir
    public static void imgShift(BufferedImage source, BufferedImage shift, int shiftPosition) {

//		long s = System.currentTimeMillis();
        Graphics2D gr = shift.createGraphics();

        gr.drawImage(source, -shiftPosition, 0, null);
        gr.dispose();

//		System.err.println(shiftPosition + " - time:" + (System.currentTimeMillis() - s));
    }

    public static int[][] matrisOlustur(BufferedImage picture) {

        int[][] renkMatris = new int[picture.getWidth()][picture.getHeight()];

//		Arrays.stream(renkMatris).forEach(e -> Arrays.fill(e, Color.gray));

        for (int j = 0; j < picture.getWidth(); j++) {

            for (int i = 0; i < picture.getHeight(); i++) {

                renkMatris[j][i] = picture.getRGB(j, (picture.getHeight() - i - 1));
            }

        }
        return renkMatris;
    }

    public static List<PPILineModel> generetaModelFromImage(BufferedImage picture) {

        int imgMatris[][] = ImgUtils.matrisOlustur(picture);

        List<PPILineModel> result = new ArrayList<PPILineModel>();

        for (int j = 0; j < imgMatris.length; j++) {
            result.add(new PPILineModel(j, imgMatris[j]));
        }

        return result;
    }
}
