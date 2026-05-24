package woyou.aidl.service;

import android.graphics.Bitmap;
import woyou.aidl.service.ICallback;

interface IWoyouService {
    void printerSelfChecking(in ICallback callback);
    String getPrinterSerialNo();
    String getPrinterVersion();
    String getPrinterModel();
    String getPrinterPaper();
    void sendRAWData(in byte[] data, in ICallback callback);
    void setAlignment(in int alignment, in ICallback callback);
    void setFontName(String typeface, in ICallback callback);
    void setFontSize(float fontsize, in ICallback callback);
    void printText(String text, in ICallback callback);
    void printTextWithFont(String text, String typeface, float fontsize, in ICallback callback);
    void printColumnsText(in String[] colsTextArr, in int[] colsWidthArr, in int[] colsAlign, in ICallback callback);
    void printBitmap(in Bitmap bitmap, in ICallback callback);
    void lineWrap(int lines, in ICallback callback);
    void printBarCode(String data, int symbology, int height, int width, int textposition, in ICallback callback);
    void printQRCode(String data, int modulesize, int errorlevel, in ICallback callback);
    void printOriginalText(String text, in ICallback callback);
    void commitPrinterBuffer();
    void enterPrinterBuffer(boolean clean);
    void exitPrinterBuffer(boolean commit);
    void exitPrinterBufferWithCallback(boolean commit, in ICallback callback);
    void initPrinter(in ICallback callback);
    int updatePrinterState();
    void printColumnsString(in String[] colsTextArr, in int[] colsWidthArr, in int[] colsAlign, in ICallback callback);
    String getPrinterModal();
    void setDoubleQRCode(String code1, String code2, int modulesize, int errorlevel, in ICallback callback);
    void setPrinterStyle(in int key, in String value, in ICallback callback);
    void printBitmapWithSize(in Bitmap bitmap, int width, int height, in ICallback callback);
    void labelLocate(in ICallback callback);
    void labelOutput(in ICallback callback);
    void cutPaper(in ICallback callback);
    void setPageFormat(int style, in ICallback callback);
    void printBitmapCustom(in Bitmap bitmap, int type, in ICallback callback);
    void updatePrinterStateWithCallback(in ICallback callback);
}
